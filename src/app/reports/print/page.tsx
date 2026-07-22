import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { buildReport } from "@/lib/reports/buildReport";
import { ReportTable } from "@/components/report/ReportTable";
import { PrintButton } from "@/components/report/PrintButton";

export default async function ReportPrintPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicleId?: string; from?: string; to?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const params = await searchParams;
  if (!params.vehicleId || !params.from || !params.to) {
    redirect("/reports");
  }

  const report = await buildReport(params.vehicleId, new Date(params.from), new Date(params.to));

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-4 flex justify-end print:hidden">
        <PrintButton />
      </div>
      <ReportTable report={report} />
    </div>
  );
}
