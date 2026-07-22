import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent">
        <BarChart3 className="size-6 text-accent-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">ดูรายงานการเดินทางและค่าน้ำมัน</h1>
        <p className="text-muted-foreground">เลือกรถและช่วงวันที่ เพื่อดูสรุป ดาวน์โหลด หรือพิมพ์รายงาน</p>
      </div>
      <Link href="/reports" className={buttonVariants({ variant: "default" })}>
        ไปที่หน้ารายงาน
      </Link>
    </div>
  );
}
