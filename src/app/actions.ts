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
} from "@/lib/validation";
import { storePhoto } from "@/lib/uploads";

export type FormState = { error?: string; success?: string };

export async function registerAction(
  _state: FormState,
  form: FormData,
): Promise<FormState> {
  const parsed = registrationSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
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
  try {
    await signIn("credentials", {
      email: String(form.get("email") || "")
        .trim()
        .toLowerCase(),
      password: form.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError)
      return { error: "Email or password is incorrect. Please try again." };
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
  let image = existing?.image;
  const photo = form.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      image = await storePhoto(photo);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unable to save photo.",
      };
    }
  }
  if (!image)
    return { error: "Add a photo of your vehicle before publishing." };
  const data = {
    ...parsed.data,
    features: JSON.stringify(parsed.data.features),
    image,
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
  const recent = await prisma.inquiry.count({
    where: {
      email: parsed.data.email,
      createdAt: { gte: new Date(Date.now() - 3600000) },
    },
  });
  if (recent >= 5)
    return {
      error:
        "You've sent several inquiries recently. Please try again in an hour.",
    };
  await prisma.inquiry.create({ data: { ...parsed.data, vehicleId } });
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
