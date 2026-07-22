import { prisma } from "@/lib/db";
import { cartrackAdapter } from "@/lib/integrations/cartrack";
import type { NormalizedTrip } from "@/lib/integrations/cartrack";

export type ReportData = {
  vehicle: { id: string; name: string; plateNumber: string };
  from: Date;
  to: Date;
  trips: NormalizedTrip[];
  totals: {
    totalDistanceKm: number;
    drivingMinutes: number;
    idleMinutes: number;
  };
  fuel: {
    entries: {
      id: string;
      date: Date;
      liters: number;
      amountPaid: number;
      odometerKm: number | null;
    }[];
    totalLiters: number;
    totalAmountPaid: number;
  };
  costPerKm: number | null;
};

export async function buildReport(
  vehicleId: string,
  from: Date,
  to: Date
): Promise<ReportData> {
  const vehicle = await prisma.vehicle.findUniqueOrThrow({ where: { id: vehicleId } });

  const endOfDay = new Date(to);
  endOfDay.setHours(23, 59, 59, 999);

  const [trips, fuelEntries] = await Promise.all([
    cartrackAdapter.getTrips(vehicle.cartrackId ?? vehicle.id, from, endOfDay),
    prisma.fuelEntry.findMany({
      where: { vehicleId, date: { gte: from, lte: endOfDay } },
      orderBy: { date: "asc" },
    }),
  ]);

  const totals = trips.reduce(
    (acc, trip) => ({
      totalDistanceKm: acc.totalDistanceKm + trip.totalDistanceKm,
      drivingMinutes: acc.drivingMinutes + trip.drivingMinutes,
      idleMinutes: acc.idleMinutes + trip.idleMinutes,
    }),
    { totalDistanceKm: 0, drivingMinutes: 0, idleMinutes: 0 }
  );
  totals.totalDistanceKm = Math.round(totals.totalDistanceKm * 10) / 10;

  const totalLiters = fuelEntries.reduce((s, e) => s + e.liters, 0);
  const totalAmountPaid = fuelEntries.reduce((s, e) => s + e.amountPaid, 0);

  const costPerKm =
    totals.totalDistanceKm > 0 ? totalAmountPaid / totals.totalDistanceKm : null;

  return {
    vehicle: { id: vehicle.id, name: vehicle.name, plateNumber: vehicle.plateNumber },
    from,
    to,
    trips,
    totals,
    fuel: {
      entries: fuelEntries,
      totalLiters: Math.round(totalLiters * 100) / 100,
      totalAmountPaid: Math.round(totalAmountPaid * 100) / 100,
    },
    costPerKm: costPerKm !== null ? Math.round(costPerKm * 100) / 100 : null,
  };
}
