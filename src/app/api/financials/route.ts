import { NextResponse } from "next/server";
import { getAnnualReports } from "@/lib/financials";

/*
  Serves the derived financial payload (standalone rows + latest consolidated)
  for the investor-relations page. Reads Supabase when configured, else falls
  back to seed data — see `@/lib/financials`. No module cache: the payload is
  small and low-traffic, and the admin needs to see a submission immediately.
*/
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAnnualReports();
  return NextResponse.json(data);
}
