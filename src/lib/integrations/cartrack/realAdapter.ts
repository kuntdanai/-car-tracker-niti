import type { CartrackAdapter } from "./adapter";
import type { NormalizedTrip } from "./types";

// Fill in once Cartrack API credentials/docs are confirmed. Auth method, exact
// trip/location payload shape, and rate limits are unverified — see the plan's
// "Open Questions / Risks" section. Map the real response into NormalizedTrip
// here; nothing else in the app needs to change.
export const realAdapter: CartrackAdapter = {
  async getTrips(_vehicleExternalId: string, _from: Date, _to: Date): Promise<NormalizedTrip[]> {
    throw new Error(
      "Cartrack live integration not implemented yet. Set CARTRACK_MODE=mock to use sample data."
    );
  },
};
