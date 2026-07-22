"use client";

import { useRef, useState, useTransition } from "react";
import { createFuelEntry } from "@/lib/actions/fuel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Vehicle = { id: string; name: string; plateNumber: string };

export function FuelEntryForm({ vehicles }: { vehicles: Vehicle[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createFuelEntry(formData);
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
        <Label htmlFor="vehicleId">รถ</Label>
        <select
          id="vehicleId"
          name="vehicleId"
          required
          defaultValue=""
          className="h-9 w-48 rounded-lg border border-input bg-transparent px-3 text-sm"
        >
          <option value="" disabled>
            เลือกรถ
          </option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.plateNumber})
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="date">วันที่เติม</Label>
        <Input id="date" name="date" type="date" required className="w-40" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="liters">จำนวนลิตร</Label>
        <Input id="liters" name="liters" type="number" step="0.01" min="0" required className="w-28" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="amountPaid">จำนวนเงิน (บาท)</Label>
        <Input id="amountPaid" name="amountPaid" type="number" step="0.01" min="0" required className="w-28" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="odometerKm">เลขไมล์ (กม.)</Label>
        <Input id="odometerKm" name="odometerKm" type="number" step="1" min="0" className="w-28" />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "กำลังบันทึก..." : "บันทึก"}
      </Button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
