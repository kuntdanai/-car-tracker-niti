import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FuelEntryForm } from "@/components/fuel/FuelEntryForm";
import { FuelEntryTable } from "@/components/fuel/FuelEntryTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FuelPage() {
  const session = await auth();

  const [vehicles, entries] = await Promise.all([
    prisma.vehicle.findMany({ orderBy: { name: "asc" } }),
    prisma.fuelEntry.findMany({
      orderBy: { date: "desc" },
      take: 100,
      include: { vehicle: true, enteredBy: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">บันทึกค่าน้ำมัน</h1>

      <Card>
        <CardHeader>
          <CardTitle>เติมน้ำมันใหม่</CardTitle>
        </CardHeader>
        <CardContent>
          <FuelEntryForm vehicles={vehicles} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>รายการล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <FuelEntryTable
            entries={entries}
            currentUserId={session!.user.id}
            currentUserIsAdmin={session!.user.role === "ADMIN"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
