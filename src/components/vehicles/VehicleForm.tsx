"use client";

import { useRef, useState, useTransition } from "react";
import { createVehicle } from "@/lib/actions/vehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VehicleForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createVehicle(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="name">ชื่อรถ</Label>
        <Input id="name" name="name" placeholder="เช่น รถกระบะ 01" required className="w-40" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="plateNumber">ทะเบียนรถ</Label>
        <Input id="plateNumber" name="plateNumber" placeholder="กข 1234" required className="w-32" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="cartrackId">Cartrack ID</Label>
        <Input id="cartrackId" name="cartrackId" placeholder="ไม่บังคับ" className="w-32" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="fuelType">ประเภทน้ำมัน</Label>
        <Input id="fuelType" name="fuelType" placeholder="ดีเซล / เบนซิน" className="w-32" />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "กำลังเพิ่ม..." : "เพิ่มรถ"}
      </Button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
