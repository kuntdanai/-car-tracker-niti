import { mockAdapter } from "./mockAdapter";
import { realAdapter } from "./realAdapter";
import type { CartrackAdapter } from "./adapter";

export const cartrackAdapter: CartrackAdapter =
  process.env.CARTRACK_MODE === "live" ? realAdapter : mockAdapter;

export type { CartrackAdapter } from "./adapter";
export type { NormalizedTrip, NormalizedTripLeg } from "./types";
