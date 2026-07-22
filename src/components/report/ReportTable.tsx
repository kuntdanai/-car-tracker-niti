import type { ComponentType } from "react";
import type { ReportData } from "@/lib/reports/buildReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Route, Clock, Hourglass, Receipt, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h} ชม. ${m} นาที`;
}

function formatDateTime(d: Date) {
  return new Date(d).toLocaleString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReportTable({ report }: { report: ReportData }) {
  const { vehicle, from, to, trips, totals, fuel, costPerKm } = report;
  const legRows = trips.flatMap((trip) =>
    trip.legs.map((leg) => ({ tripId: trip.externalTripId, ...leg }))
  );

  return (
    <div id="report-content" className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">
          {vehicle.name} ({vehicle.plateNumber})
        </h2>
        <p className="text-sm text-muted-foreground">
          {new Date(from).toLocaleDateString("th-TH")} - {new Date(to).toLocaleDateString("th-TH")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryStat
          icon={Route}
          label="ระยะทางรวม"
          value={`${totals.totalDistanceKm.toLocaleString()} กม.`}
        />
        <SummaryStat icon={Clock} label="เวลาขับรวม" value={formatMinutes(totals.drivingMinutes)} />
        <SummaryStat icon={Hourglass} label="เวลาพักรวม" value={formatMinutes(totals.idleMinutes)} />
        <SummaryStat
          icon={Receipt}
          label="ค่าน้ำมัน / กม."
          value={costPerKm !== null ? `${costPerKm.toLocaleString()} บาท` : "-"}
          accent
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายละเอียดการเดินทาง</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col p-0">
          {legRows.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              ไม่มีข้อมูลการเดินทางในช่วงวันที่เลือก
            </p>
          )}
          {legRows.map((leg, i) => (
            <div
              key={`${leg.tripId}-${leg.sequence}-${i}`}
              className="flex items-center gap-3 border-b border-border px-6 py-3 last:border-b-0"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent">
                <MapPin className="size-4 text-accent-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <span className="truncate">{leg.fromLabel}</span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{leg.toLabel}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(leg.startedAt)}&ndash;{formatDateTime(leg.endedAt)} &middot;{" "}
                  {leg.distanceKm.toLocaleString()} กม. &middot; ขับ {formatMinutes(leg.drivingMinutes)} &middot;{" "}
                  พัก {formatMinutes(leg.idleMinutes)}
                </p>
              </div>
            </div>
          ))}
          {legRows.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3 text-sm font-medium">
              <span>รวม</span>
              <span>
                {totals.totalDistanceKm.toLocaleString()} กม. &middot; ขับ{" "}
                {formatMinutes(totals.drivingMinutes)} &middot; พัก {formatMinutes(totals.idleMinutes)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ค่าน้ำมันในช่วงเวลานี้</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead className="text-right">ลิตร</TableHead>
                <TableHead className="text-right">จำนวนเงิน</TableHead>
                <TableHead className="text-right">เลขไมล์</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fuel.entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    ไม่มีรายการเติมน้ำมันในช่วงวันที่เลือก
                  </TableCell>
                </TableRow>
              )}
              {fuel.entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{new Date(e.date).toLocaleDateString("th-TH")}</TableCell>
                  <TableCell className="text-right">{e.liters.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{e.amountPaid.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{e.odometerKm?.toLocaleString() ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            {fuel.entries.length > 0 && (
              <tfoot>
                <TableRow>
                  <TableCell className="font-medium">รวม</TableCell>
                  <TableCell className="text-right font-medium">
                    {fuel.totalLiters.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {fuel.totalAmountPaid.toLocaleString()}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </tfoot>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Card className={cn(accent && "bg-accent")}>
      <CardContent className="p-4">
        <p
          className={cn(
            "flex items-center gap-1.5 text-sm",
            accent ? "text-accent-foreground" : "text-muted-foreground"
          )}
        >
          <Icon className="size-3.5" />
          {label}
        </p>
        <p className={cn("text-lg font-semibold", accent && "text-accent-foreground")}>{value}</p>
      </CardContent>
    </Card>
  );
}
