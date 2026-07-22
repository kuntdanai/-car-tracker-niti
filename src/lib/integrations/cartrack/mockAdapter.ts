import type { CartrackAdapter } from "./adapter";
import type { NormalizedTrip, NormalizedTripLeg } from "./types";

// Deterministic PRNG (mulberry32) seeded from a string so the same
// vehicle + day always generates the same sample trips.
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PLACES: { label: string; lat: number; lng: number }[] = [
  { label: "คลังสินค้าบางนา", lat: 13.6708, lng: 100.6053 },
  { label: "สำนักงานใหญ่ กรุงเทพฯ", lat: 13.7563, lng: 100.5018 },
  { label: "สาขาชลบุรี", lat: 13.3611, lng: 100.9847 },
  { label: "สาขาระยอง", lat: 12.6833, lng: 101.2372 },
  { label: "ท่าเรือแหลมฉบัง", lat: 13.0827, lng: 100.8891 },
  { label: "คลังสินค้าสมุทรปราการ", lat: 13.5991, lng: 100.5998 },
  { label: "สาขาฉะเชิงเทรา", lat: 13.6904, lng: 101.0779 },
  { label: "ลูกค้า จ.ชลบุรี", lat: 13.2500, lng: 101.0833 },
];

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function generateTripsForDay(
  vehicleExternalId: string,
  day: Date
): NormalizedTrip[] {
  const rand = seededRandom(`${vehicleExternalId}:${toDateKey(day)}`);

  // Skip some days entirely (vehicle not used) — weighted so most weekdays have trips.
  if (rand() < 0.15) return [];

  const tripCount = 1 + Math.floor(rand() * 2); // 1-2 trips per active day
  const trips: NormalizedTrip[] = [];

  let cursor = new Date(day);
  cursor.setHours(7 + Math.floor(rand() * 2), Math.floor(rand() * 60), 0, 0);

  for (let t = 0; t < tripCount; t++) {
    const legCount = 1 + Math.floor(rand() * 2); // 1-2 legs per trip
    const legs: NormalizedTripLeg[] = [];
    let placeIdx = Math.floor(rand() * PLACES.length);
    let legCursor = new Date(cursor);

    for (let l = 0; l < legCount; l++) {
      const from = PLACES[placeIdx];
      let nextIdx = Math.floor(rand() * PLACES.length);
      if (nextIdx === placeIdx) nextIdx = (nextIdx + 1) % PLACES.length;
      const to = PLACES[nextIdx];
      placeIdx = nextIdx;

      const distanceKm = Math.round((20 + rand() * 90) * 10) / 10;
      const drivingMinutes = Math.round((distanceKm / 55) * 60 + rand() * 10);
      const idleMinutes = Math.round(5 + rand() * 35);

      const startedAt = new Date(legCursor);
      const endedAt = new Date(startedAt.getTime() + drivingMinutes * 60_000);
      legCursor = new Date(endedAt.getTime() + idleMinutes * 60_000);

      legs.push({
        sequence: l + 1,
        fromLabel: from.label,
        fromLat: from.lat,
        fromLng: from.lng,
        toLabel: to.label,
        toLat: to.lat,
        toLng: to.lng,
        startedAt,
        endedAt,
        distanceKm,
        drivingMinutes,
        idleMinutes,
      });
    }

    const startedAt = legs[0].startedAt;
    const endedAt = legs[legs.length - 1].endedAt;
    const totalDistanceKm = Math.round(legs.reduce((s, l) => s + l.distanceKm, 0) * 10) / 10;
    const drivingMinutes = legs.reduce((s, l) => s + l.drivingMinutes, 0);
    const idleMinutes = legs.reduce((s, l) => s + l.idleMinutes, 0);

    trips.push({
      externalTripId: `MOCK-${vehicleExternalId}-${toDateKey(day)}-${t + 1}`,
      startedAt,
      endedAt,
      totalDistanceKm,
      drivingMinutes,
      idleMinutes,
      legs,
    });

    // next trip starts a bit after this one ends, same day
    cursor = new Date(legCursor.getTime() + Math.round(rand() * 60) * 60_000);
  }

  return trips;
}

export const mockAdapter: CartrackAdapter = {
  async getTrips(vehicleExternalId, from, to) {
    const trips: NormalizedTrip[] = [];
    const day = new Date(from);
    day.setHours(0, 0, 0, 0);
    const end = new Date(to);
    end.setHours(0, 0, 0, 0);

    while (day.getTime() <= end.getTime()) {
      trips.push(...generateTripsForDay(vehicleExternalId, day));
      day.setDate(day.getDate() + 1);
    }

    return trips;
  },
};
