export function parseReportParams(searchParams: URLSearchParams) {
  const vehicleId = searchParams.get("vehicleId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!vehicleId || !from || !to) {
    return null;
  }

  return { vehicleId, from: new Date(from), to: new Date(to) };
}
