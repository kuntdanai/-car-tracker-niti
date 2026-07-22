"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

const vehicleSchema = z.object({
  name: z.string().min(1, "กรุณาระบุชื่อรถ"),
  plateNumber: z.string().min(1, "กรุณาระบุทะเบียนรถ"),
  cartrackId: z.string().optional(),
  fuelType: z.string().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("ต้องเป็นผู้ดูแลระบบเท่านั้น");
  }
}

export async function createVehicle(formData: FormData) {
  await requireAdmin();

  const parsed = vehicleSchema.safeParse({
    name: formData.get("name"),
    plateNumber: formData.get("plateNumber"),
    cartrackId: formData.get("cartrackId") || undefined,
    fuelType: formData.get("fuelType") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }

  await prisma.vehicle.create({ data: parsed.data });
  revalidatePath("/vehicles");
  return { error: null };
}

export async function deleteVehicle(vehicleId: string) {
  await requireAdmin();
  await prisma.vehicle.delete({ where: { id: vehicleId } });
  revalidatePath("/vehicles");
}
