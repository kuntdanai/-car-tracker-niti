import Link from "next/link";
import { prisma } from "@/lib/db";
import { buildReport } from "@/lib/reports/buildReport";
import { ReportFilters } from "@/components/report/ReportFilters";
import { ReportTable } from "@/components/report/ReportTable";
import { buttonVariants } from "@/components/ui/button";

function defaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { from: fmt(from), to: fmt(to) };
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicleId?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const vehicles = await prisma.vehicle.findMany({ orderBy: { name: "asc" } });
  const defaults = defaultDateRange();

  const hasFilters = Boolean(params.vehicleId && params.from && params.to);
  const report = hasFilters
    ? await buildReport(params.vehicleId!, new Date(params.from!), new Date(params.to!))
    : null;

  const exportQuery = hasFilters
    ? new URLSearchParams({
        vehicleId: params.vehicleId!,
        from: params.from!,
        to: params.to!,
      }).toString()
    : "";

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">รายงานการเดินทางและค่าน้ำมัน</h1>

      <ReportFilters
        vehicles={vehicles}
        defaultVehicleId={params.vehicleId}
        defaultFrom={params.from ?? defaults.from}
        defaultTo={params.to ?? defaults.to}
      />

      {report ? (
        <>
          <div className="flex gap-3">
            <a
              href={`/api/reports/export/pdf?${exportQuery}`}
              className={buttonVariants({ variant: "outline" })}
            >
              ดาวน์โหลด PDF
            </a>
            <a
              href={`/api/reports/export/excel?${exportQuery}`}
              className={buttonVariants({ variant: "outline" })}
            >
              ดาวน์โหลด Excel
            </a>
            <Link
              href={`/reports/print?${exportQuery}`}
              target="_blank"
              className={buttonVariants({ variant: "outline" })}
            >
              พิมพ์รายงาน
            </Link>
          </div>
          <ReportTable report={report} />
        </>
      ) : (
        <p className="text-muted-foreground">เลือกรถและช่วงวันที่ แล้วกด &quot;แสดงรายงาน&quot;</p>
      )}
    </div>
  );
}
