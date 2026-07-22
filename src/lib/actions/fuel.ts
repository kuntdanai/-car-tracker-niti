"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

const fuelEntrySchema = z.object({
  vehicleId: z.string().min(1, "กรุณาเลือกรถ"),
  date: z.string().min(1, "กรุณาระบุวันที่"),
  liters: z.coerce.number().positive("จำนวนลิตรต้องมากกว่า 0"),
  amountPaid: z.coerce.number().positive("จำนวนเงินต้องมากกว่า 0"),
  odometerKm: z.coerce.number().optional(),
});

export async function createFuelEntry(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "กรุณาเข้าสู่ระบบ" };
  }

  const parsed = fuelEntrySchema.safeParse({
    vehicleId: formData.get("vehicleId"),
    date: formData.get("date"),
    liters: formData.get("liters"),
    amountPaid: formData.get("amountPaid"),
    odometerKm: formData.get("odometerKm") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }

  const { vehicleId, date, liters, amountPaid, odometerKm } = parsed.data;

  await prisma.fuelEntry.create({
    data: {
      vehicleId,
      date: new Date(date),
      liters,
      amountPaid,
      odometerKm,
      enteredById: session.user.id,
    },
  });

  revalidatePath("/fuel");
  return { error: null };
}

export async function deleteFuelEntry(entryId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const entry = await prisma.fuelEntry.findUnique({ where: { id: entryId } });
  if (!entry) return;

  if (session.user.role !== "ADMIN" && entry.enteredById !== session.user.id) {
    throw new Error("คุณสามารถลบได้เฉพาะรายการที่ตัวเองบันทึกเท่านั้น");
  }

  await prisma.fuelEntry.delete({ where: { id: entryId } });
  revalidatePath("/fuel");
}
