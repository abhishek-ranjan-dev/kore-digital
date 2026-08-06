import { NextResponse } from "next/server";
import { getPolicies } from "@/lib/policies";

/*
  Serves the grouped statutory-policy payload for the investor-relations page.
  Reads Supabase when configured, else falls back to seed data — see
  `@/lib/policies`. No module cache: an admin submission must show immediately.
*/
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getPolicies();
  return NextResponse.json(data);
}
