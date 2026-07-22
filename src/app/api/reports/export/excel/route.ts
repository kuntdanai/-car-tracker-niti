import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { buildReport } from "@/lib/reports/buildReport";
import { reportToExcelBuffer } from "@/lib/reports/toExcel";
import { parseReportParams } from "@/lib/reports/parseReportParams";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = parseReportParams(request.nextUrl.searchParams);
  if (!params) {
    return NextResponse.json({ error: "Missing vehicleId/from/to" }, { status: 400 });
  }

  const report = await buildReport(params.vehicleId, params.from, params.to);
  const excelBuffer = await reportToExcelBuffer(report);
  const filename = encodeURIComponent(`report-${report.vehicle.plateNumber}.xlsx`);

  return new NextResponse(new Uint8Array(excelBuffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="report.xlsx"; filename*=UTF-8''${filename}`,
    },
  });
}
