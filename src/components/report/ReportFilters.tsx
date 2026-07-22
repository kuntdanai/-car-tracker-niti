import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Vehicle = { id: string; name: string; plateNumber: string };

export function ReportFilters({
  vehicles,
  defaultVehicleId,
  defaultFrom,
  defaultTo,
}: {
  vehicles: Vehicle[];
  defaultVehicleId?: string;
  defaultFrom?: string;
  defaultTo?: string;
}) {
  return (
    <form
      method="GET"
      className="flex flex-wrap items-end gap-3 rounded-xl bg-muted/60 p-4"
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="vehicleId">รถ</Label>
        <select
          id="vehicleId"
          name="vehicleId"
          required
          defaultValue={defaultVehicleId ?? ""}
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
        <Label htmlFor="from">ตั้งแต่วันที่</Label>
        <Input id="from" name="from" type="date" required defaultValue={defaultFrom} className="w-40" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="to">ถึงวันที่</Label>
        <Input id="to" name="to" type="date" required defaultValue={defaultTo} className="w-40" />
      </div>
      <Button type="submit">แสดงรายงาน</Button>
    </form>
  );
}
