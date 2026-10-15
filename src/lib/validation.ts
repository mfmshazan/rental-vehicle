import { z } from "zod";
import { categories, cities, features } from "./marketplace";

export const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s()-]/g, ""))
  .refine(
    (value) => /^(?:\+94|0)7\d{8}$/.test(value),
    "Enter a Sri Lankan mobile number, for example 077 123 4567.",
  );
export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Enter a valid email address.").toLowerCase(),
  phone: phoneSchema,
  password: z
    .string()
    .min(8, "Use at least 8 characters for your password.")
    .max(72),
});
export const vehicleSchema = z.object({
  title: z.string().trim().min(5, "Add a descriptive listing title.").max(80),
  brand: z.string().trim().min(2).max(40),
  model: z.string().trim().min(1).max(40),
  year: z.coerce
    .number()
    .int()
    .min(1970)
    .max(new Date().getFullYear() + 1),
  category: z.enum(categories.slice(1) as [string, ...string[]]),
  city: z.enum(cities),
  dailyRate: z.coerce
    .number()
    .int()
    .min(1000, "Daily rate must be at least LKR 1,000.")
    .max(500000),
  transmission: z.enum(["Automatic", "Manual"]),
  fuel: z.enum(["Petrol", "Diesel", "Hybrid", "Electric"]),
  seats: z.coerce.number().int().min(2).max(20),
  driveType: z.enum(["Self-drive", "With driver"]),
  description: z
    .string()
    .trim()
    .min(30, "Tell renters a little more (at least 30 characters).")
    .max(3000),
  features: z.array(z.enum(features)).max(8),
});
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose your rental dates.")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  }, "Choose a valid date.");
export const inquirySchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: z.email().toLowerCase(),
    phone: phoneSchema,
    startDate: date,
    endDate: date,
    message: z
      .string()
      .trim()
      .min(10, "Please add a short message for the owner.")
      .max(1500),
  })
  .refine((value) => value.endDate >= value.startDate, {
    message: "Return date must be on or after pickup.",
    path: ["endDate"],
  })
  .refine(
    (value) =>
      value.startDate >=
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Colombo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    { message: "Choose today or a future pickup date.", path: ["startDate"] },
  );
