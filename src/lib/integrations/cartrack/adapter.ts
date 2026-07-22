import type { NormalizedTrip } from "./types";

export interface CartrackAdapter {
  getTrips(
    vehicleExternalId: string,
    from: Date,
    to: Date
  ): Promise<NormalizedTrip[]>;
}
