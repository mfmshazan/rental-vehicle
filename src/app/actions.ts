"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  registrationSchema,
  vehicleSchema,
  inquirySchema,
  blockedPeriodSchema,
} from "@/lib/validation";
import { parsePhotos, MAX_PHOTOS } from "@/lib/marketplace";
import {
  clientIp,
  AUTH_WINDOW_MS,
  MAX_LOGIN_FAILS_PER_EMAIL,
  MAX_LOGIN_FAILS_PER_IP,
  REGISTER_WINDOW_MS,
  MAX_REGISTERS_PER_IP,
  INQUIRY_WINDOW_MS,
  MAX_INQUIRIES_PER_EMAIL,
  MAX_INQUIRIES_PER_IP,
} from "@/lib/rate-limit";
import { storePhotos, MAX_PHOTO_BYTES } from "@/lib/uploads";

export type FormState = { error?: string; success?: string };

export async function registerAction(
  _state: FormState,
  form: FormData,
): Promise<FormState> {
  const parsed = registrationSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const ip = await clientIp();
  const recentRegisters = await prisma.authAttempt.count({
    where: {
      kind: "register",
      ip,
      createdAt: { gte: new Date(Date.now() - REGISTER_WINDOW_MS) },
    },
  });
  if (recentRegisters >= MAX_REGISTERS_PER_IP)
    return {
      error: "Too many sign-ups from this network. Please try again later.",
    };
  await prisma.authAttempt.create({
    data: { kind: "register", email: parsed.data.email, ip },
  });
  const { password, ...profile } = parsed.data;
  try {
    await prisma.user.create({
      data: { ...profile, passwordHash: await bcrypt.hash(password, 12) },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return { error: "An account already uses this email. Please sign in." };
    return { error: "We couldn't create your account. Please try again." };
  }
  await signIn("credentials", {
    email: profile.email,
    password,
    redirectTo: "/dashboard",
  });
  return {};
}

export async function loginAction(
  _state: FormState,
  form: FormData,
): Promise<FormState> {
  const email = String(form.get("email") || "")
    .trim()
    .toLowerCase();
  const ip = await clientIp();
  const since = new Date(Date.now() - AUTH_WINDOW_MS);
  const [emailFails, ipFails] = await Promise.all([
    prisma.authAttempt.count({
      where: { kind: "login", success: false, email, createdAt: { gte: since } },
    }),
    prisma.authAttempt.count({
      where: { kind: "login", success: false, ip, createdAt: { gte: since } },
    }),
  ]);
  if (
    emailFails >= MAX_LOGIN_FAILS_PER_EMAIL ||
    ipFails >= MAX_LOGIN_FAILS_PER_IP
  )
    return {
      error: "Too many attempts. Please wait a few minutes and try again.",
    };
  try {
    await signIn("credentials", {
      email,
      password: form.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      await prisma.authAttempt.create({
        data: { kind: "login", email, ip, success: false },
      });
      return { error: "Email or password is incorrect. Please try again." };
    }
    throw error;
  }
  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function saveVehicleAction(
  _state: FormState,
  form: FormData,
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id)
    return { error: "Please sign in to publish a vehicle." };
  const parsed = vehicleSchema.safeParse({
    ...Object.fromEntries(form),
    features: form.getAll("features"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const id = String(form.get("id") || "");
  const existing = id
    ? await prisma.vehicle.findFirst({
        where: { id, ownerId: session.user.id, demo: false },
      })
    : null;
  if (id && !existing)
    return {
      error: "This listing is unavailable or belongs to another owner.",
    };
  // Existing photos carried over on edit (fall back to the legacy single image).
  const existingPhotos: string[] = existing
    ? parsePhotos(existing.photos, existing.image)
    : [];
  const removed = new Set(form.getAll("removePhoto").map(String));
  const keptPhotos = existingPhotos.filter((url) => !removed.has(url));
  const newFiles = form
    .getAll("photo")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (keptPhotos.length + newFiles.length > MAX_PHOTOS)
    return { error: `You can add up to ${MAX_PHOTOS} photos per listing.` };
  if (newFiles.reduce((sum, file) => sum + file.size, 0) > MAX_PHOTOS * MAX_PHOTO_BYTES)
    return { error: "Those photos are too large together. Please upload smaller images." };
  let uploaded: string[];
  try {
    uploaded = await storePhotos(newFiles);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to save photo.",
    };
  }
  const photos = [...keptPhotos, ...uploaded];
  if (photos.length === 0)
    return { error: "Add a photo of your vehicle before publishing." };
  const data = {
    ...parsed.data,
    features: JSON.stringify(parsed.data.features),
    image: photos[0], // primary photo, kept for cards and back-compat
    photos: JSON.stringify(photos),
  };
  try {
    if (existing)
      await prisma.vehicle.update({
        where: { id: existing.id, ownerId: session.user.id },
        data,
      });
    else
      await prisma.vehicle.create({
        data: { ...data, ownerId: session.user.id },
      });
  } catch {
    return { error: "Your listing could not be saved. Please try again." };
  }
  revalidatePath("/");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/vehicles/${id}`);
  redirect("/dashboard?published=1");
}

export async function toggleVehicleAction(form: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const id = String(form.get("id") || "");
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, ownerId: session.user.id, demo: false },
  });
  if (!vehicle) return;
  await prisma.vehicle.update({
    where: { id, ownerId: session.user.id },
    data: { active: !vehicle.active },
  });
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/vehicles/${id}`);
}

export async function addBlockedPeriodAction(
  _state: FormState,
  form: FormData,
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in." };
  const vehicleId = String(form.get("vehicleId") || "");
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, ownerId: session.user.id, demo: false },
    select: { id: true },
  });
  if (!vehicle)
    return {
      error: "This listing is unavailable or belongs to another owner.",
    };
  const parsed = blockedPeriodSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await prisma.blockedPeriod.create({ data: { ...parsed.data, vehicleId } });
  revalidatePath(`/dashboard/vehicles/${vehicleId}/edit`);
  revalidatePath(`/vehicles/${vehicleId}`);
  return { success: "Those dates are now marked unavailable." };
}

export async function removeBlockedPeriodAction(form: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const id = String(form.get("id") || "");
  const vehicleId = String(form.get("vehicleId") || "");
  await prisma.blockedPeriod.deleteMany({
    where: { id, vehicle: { ownerId: session.user.id } },
  });
  revalidatePath(`/dashboard/vehicles/${vehicleId}/edit`);
  revalidatePath(`/vehicles/${vehicleId}`);
}

export async function inquiryAction(
  vehicleId: string,
  _state: FormState,
  form: FormData,
): Promise<FormState> {
  if (form.get("website")) return { error: "Unable to send inquiry." };
  const parsed = inquirySchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, active: true, demo: false },
  });
  if (!vehicle) return { error: "This vehicle is not accepting inquiries." };
  const ip = await clientIp();
  const since = new Date(Date.now() - INQUIRY_WINDOW_MS);
  const [byEmail, byIp] = await Promise.all([
    prisma.inquiry.count({
      where: { email: parsed.data.email, createdAt: { gte: since } },
    }),
    prisma.inquiry.count({ where: { ip, createdAt: { gte: since } } }),
  ]);
  if (byEmail >= MAX_INQUIRIES_PER_EMAIL || byIp >= MAX_INQUIRIES_PER_IP)
    return {
      error:
        "You've sent several inquiries recently. Please try again in an hour.",
    };
  await prisma.inquiry.create({ data: { ...parsed.data, vehicleId, ip } });
  revalidatePath("/dashboard");
  return {
    success:
      "Your inquiry is in the owner's inbox. They can reply using the contact details you provided.",
  };
}

export async function markInquiryReadAction(form: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  await prisma.inquiry.updateMany({
    where: {
      id: String(form.get("id") || ""),
      vehicle: { ownerId: session.user.id },
    },
    data: { read: true },
  });
  revalidatePath("/dashboard");
}
