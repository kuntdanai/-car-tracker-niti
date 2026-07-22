"use client";

import { useTransition } from "react";
import { deleteFuelEntry } from "@/lib/actions/fuel";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FuelEntry = {
  id: string;
  date: Date;
  liters: number;
  amountPaid: number;
  odometerKm: number | null;
  vehicle: { name: string; plateNumber: string };
  enteredBy: { name: string };
  enteredById: string;
};

export function FuelEntryTable({
  entries,
  currentUserId,
  currentUserIsAdmin,
}: {
  entries: FuelEntry[];
  currentUserId: string;
  currentUserIsAdmin: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>วันที่</TableHead>
          <TableHead>รถ</TableHead>
          <TableHead className="text-right">ลิตร</TableHead>
          <TableHead className="text-right">จำนวนเงิน</TableHead>
          <TableHead className="text-right">เลขไมล์</TableHead>
          <TableHead>ผู้บันทึก</TableHead>
          <TableHead className="text-right">จัดการ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground">
              ยังไม่มีรายการเติมน้ำมัน
            </TableCell>
          </TableRow>
        )}
        {entries.map((e) => {
          const canDelete = currentUserIsAdmin || e.enteredById === currentUserId;
          return (
            <TableRow key={e.id}>
              <TableCell>{new Date(e.date).toLocaleDateString("th-TH")}</TableCell>
              <TableCell>
                {e.vehicle.name} ({e.vehicle.plateNumber})
              </TableCell>
              <TableCell className="text-right">{e.liters.toLocaleString()}</TableCell>
              <TableCell className="text-right">{e.amountPaid.toLocaleString()}</TableCell>
              <TableCell className="text-right">{e.odometerKm?.toLocaleString() ?? "-"}</TableCell>
              <TableCell>{e.enteredBy.name}</TableCell>
              <TableCell className="text-right">
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        if (confirm("ลบรายการนี้ใช่หรือไม่?")) {
                          await deleteFuelEntry(e.id);
                        }
                      })
                    }
                  >
                    ลบ
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
