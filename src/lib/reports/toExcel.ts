import ExcelJS from "exceljs";
import type { ReportData } from "./buildReport";

function formatDateTime(d: Date) {
  return new Date(d).toLocaleString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("th-TH");
}

export async function reportToExcelBuffer(report: ReportData): Promise<Buffer> {
  const { vehicle, from, to, trips, totals, fuel, costPerKm } = report;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Car Tracker Niti";
  workbook.created = new Date();

  const headerFill: ExcelJS.Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFEFEFEF" },
  };

  // --- Summary sheet ---
  const summarySheet = workbook.addWorksheet("สรุป");
  summarySheet.columns = [{ width: 28 }, { width: 24 }];
  summarySheet.addRow(["รถ", `${vehicle.name} (${vehicle.plateNumber})`]);
  summarySheet.addRow(["ช่วงวันที่", `${formatDate(from)} - ${formatDate(to)}`]);
  summarySheet.addRow([]);
  summarySheet.addRow(["ระยะทางรวม (กม.)", totals.totalDistanceKm]);
  summarySheet.addRow(["เวลาขับรวม (นาที)", totals.drivingMinutes]);
  summarySheet.addRow(["เวลาพักรวม (นาที)", totals.idleMinutes]);
  summarySheet.addRow(["ค่าน้ำมันรวม (บาท)", fuel.totalAmountPaid]);
  summarySheet.addRow(["น้ำมันรวม (ลิตร)", fuel.totalLiters]);
  summarySheet.addRow(["ค่าน้ำมันต่อกิโลเมตร (บาท/กม.)", costPerKm ?? "-"]);
  summarySheet.getColumn(1).font = { bold: true };

  // --- Trips sheet ---
  const tripsSheet = workbook.addWorksheet("การเดินทาง");
  tripsSheet.columns = [
    { header: "จาก", key: "from", width: 24 },
    { header: "ถึง", key: "to", width: 24 },
    { header: "เวลาเริ่ม", key: "start", width: 20 },
    { header: "เวลาสิ้นสุด", key: "end", width: 20 },
    { header: "ระยะทาง (กม.)", key: "distance", width: 14 },
    { header: "เวลาขับ (นาที)", key: "driving", width: 14 },
    { header: "เวลาพัก (นาที)", key: "idle", width: 14 },
  ];
  tripsSheet.getRow(1).font = { bold: true };
  tripsSheet.getRow(1).fill = headerFill;

  for (const trip of trips) {
    for (const leg of trip.legs) {
      tripsSheet.addRow({
        from: leg.fromLabel,
        to: leg.toLabel,
        start: formatDateTime(leg.startedAt),
        end: formatDateTime(leg.endedAt),
        distance: leg.distanceKm,
        driving: leg.drivingMinutes,
        idle: leg.idleMinutes,
      });
    }
  }
  const totalsRow = tripsSheet.addRow({
    from: "รวม",
    distance: totals.totalDistanceKm,
    driving: totals.drivingMinutes,
    idle: totals.idleMinutes,
  });
  totalsRow.font = { bold: true };

  // --- Fuel sheet ---
  const fuelSheet = workbook.addWorksheet("ค่าน้ำมัน");
  fuelSheet.columns = [
    { header: "วันที่", key: "date", width: 16 },
    { header: "ลิตร", key: "liters", width: 12 },
    { header: "จำนวนเงิน (บาท)", key: "amount", width: 16 },
    { header: "เลขไมล์ (กม.)", key: "odometer", width: 14 },
  ];
  fuelSheet.getRow(1).font = { bold: true };
  fuelSheet.getRow(1).fill = headerFill;

  for (const e of fuel.entries) {
    fuelSheet.addRow({
      date: formatDate(e.date),
      liters: e.liters,
      amount: e.amountPaid,
      odometer: e.odometerKm ?? "-",
    });
  }
  const fuelTotalsRow = fuelSheet.addRow({
    date: "รวม",
    liters: fuel.totalLiters,
    amount: fuel.totalAmountPaid,
  });
  fuelTotalsRow.font = { bold: true };

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
