import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { ReportData } from "./buildReport";

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 9, fontFamily: "Helvetica" },
  title: { fontSize: 14, marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#555", marginBottom: 12 },
  statsRow: { flexDirection: "row", marginBottom: 14, gap: 8 },
  statBox: { flex: 1, border: "1px solid #ddd", borderRadius: 4, padding: 6 },
  statLabel: { fontSize: 7, color: "#666" },
  statValue: { fontSize: 11, marginTop: 2 },
  sectionTitle: { fontSize: 11, marginBottom: 6, marginTop: 10 },
  table: { display: "flex", width: "100%", borderTop: "1px solid #ccc", borderLeft: "1px solid #ccc" },
  row: { flexDirection: "row" },
  th: {
    flex: 1,
    padding: 4,
    fontSize: 8,
    borderRight: "1px solid #ccc",
    borderBottom: "1px solid #ccc",
    backgroundColor: "#f2f2f2",
  },
  td: {
    flex: 1,
    padding: 4,
    fontSize: 8,
    borderRight: "1px solid #ccc",
    borderBottom: "1px solid #ccc",
  },
});

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}ชม ${m}น`;
}

function formatDateTime(d: Date) {
  return new Date(d).toLocaleString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("th-TH");
}

function ReportDocument({ report }: { report: ReportData }) {
  const { vehicle, from, to, trips, totals, fuel, costPerKm } = report;
  const legRows = trips.flatMap((trip) => trip.legs);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>
          รายงานการเดินทางและค่าน้ำมัน — {vehicle.name} ({vehicle.plateNumber})
        </Text>
        <Text style={styles.subtitle}>
          {formatDate(from)} - {formatDate(to)}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ระยะทางรวม</Text>
            <Text style={styles.statValue}>{totals.totalDistanceKm.toLocaleString()} กม.</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>เวลาขับรวม</Text>
            <Text style={styles.statValue}>{formatMinutes(totals.drivingMinutes)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>เวลาพักรวม</Text>
            <Text style={styles.statValue}>{formatMinutes(totals.idleMinutes)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ค่าน้ำมัน / กม.</Text>
            <Text style={styles.statValue}>{costPerKm !== null ? `${costPerKm} บาท` : "-"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>รายละเอียดการเดินทาง</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.th}>จาก</Text>
            <Text style={styles.th}>ถึง</Text>
            <Text style={styles.th}>เวลาเริ่ม</Text>
            <Text style={styles.th}>เวลาสิ้นสุด</Text>
            <Text style={styles.th}>ระยะทาง (กม.)</Text>
            <Text style={styles.th}>เวลาขับ</Text>
            <Text style={styles.th}>เวลาพัก</Text>
          </View>
          {legRows.map((leg, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.td}>{leg.fromLabel}</Text>
              <Text style={styles.td}>{leg.toLabel}</Text>
              <Text style={styles.td}>{formatDateTime(leg.startedAt)}</Text>
              <Text style={styles.td}>{formatDateTime(leg.endedAt)}</Text>
              <Text style={styles.td}>{leg.distanceKm}</Text>
              <Text style={styles.td}>{formatMinutes(leg.drivingMinutes)}</Text>
              <Text style={styles.td}>{formatMinutes(leg.idleMinutes)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>ค่าน้ำมันในช่วงเวลานี้</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.th}>วันที่</Text>
            <Text style={styles.th}>ลิตร</Text>
            <Text style={styles.th}>จำนวนเงิน</Text>
            <Text style={styles.th}>เลขไมล์</Text>
          </View>
          {fuel.entries.map((e) => (
            <View style={styles.row} key={e.id}>
              <Text style={styles.td}>{formatDate(e.date)}</Text>
              <Text style={styles.td}>{e.liters}</Text>
              <Text style={styles.td}>{e.amountPaid}</Text>
              <Text style={styles.td}>{e.odometerKm ?? "-"}</Text>
            </View>
          ))}
          <View style={styles.row}>
            <Text style={styles.td}>รวม</Text>
            <Text style={styles.td}>{fuel.totalLiters}</Text>
            <Text style={styles.td}>{fuel.totalAmountPaid}</Text>
            <Text style={styles.td}></Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function reportToPdfBuffer(report: ReportData): Promise<Buffer> {
  return renderToBuffer(<ReportDocument report={report} />);
}
