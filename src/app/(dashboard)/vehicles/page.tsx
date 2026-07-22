import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { VehicleTable } from "@/components/vehicles/VehicleTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function VehiclesPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">จัดการรถ</h1>

      <Card>
        <CardHeader>
          <CardTitle>เพิ่มรถใหม่</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>รายการรถทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleTable vehicles={vehicles} />
        </CardContent>
      </Card>
    </div>
  );
}
