// Normalized shape our app works with, regardless of which Cartrack adapter produced it.
// Isolates the rest of the app from Cartrack's real (unconfirmed) API payload shape.

export type NormalizedTripLeg = {
  sequence: number;
  fromLabel: string;
  fromLat: number;
  fromLng: number;
  toLabel: string;
  toLat: number;
  toLng: number;
  startedAt: Date;
  endedAt: Date;
  distanceKm: number;
  drivingMinutes: number;
  idleMinutes: number;
};

export type NormalizedTrip = {
  externalTripId: string;
  startedAt: Date;
  endedAt: Date;
  totalDistanceKm: number;
  drivingMinutes: number;
  idleMinutes: number;
  legs: NormalizedTripLeg[];
};
