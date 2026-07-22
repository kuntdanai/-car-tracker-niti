"use client";

import { useTransition } from "react";
import { deleteVehicle } from "@/lib/actions/vehicles";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Vehicle = {
  id: string;
  name: string;
  plateNumber: string;
  cartrackId: string | null;
  fuelType: string | null;
};

export function VehicleTable({ vehicles }: { vehicles: Vehicle[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ชื่อรถ</TableHead>
          <TableHead>ทะเบียน</TableHead>
          <TableHead>Cartrack ID</TableHead>
          <TableHead>ประเภทน้ำมัน</TableHead>
          <TableHead className="text-right">จัดการ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              ยังไม่มีรถในระบบ
            </TableCell>
          </TableRow>
        )}
        {vehicles.map((v) => (
          <TableRow key={v.id}>
            <TableCell>{v.name}</TableCell>
            <TableCell>{v.plateNumber}</TableCell>
            <TableCell>{v.cartrackId ?? "-"}</TableCell>
            <TableCell>{v.fuelType ?? "-"}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    if (confirm(`ลบรถ "${v.name}" ใช่หรือไม่?`)) {
                      await deleteVehicle(v.id);
                    }
                  })
                }
              >
                ลบ
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
