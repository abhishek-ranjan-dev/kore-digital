import { getSupabaseRead } from "@/lib/supabase/server";
import {
  deriveFinancials,
  mapDbRow,
  SEED_PAYLOAD,
  type FinancialsPayload,
} from "@/lib/financials-data";

/*
  Server-only financial reads. Keeps the Supabase client out of any client
  bundle — client components import the pure seed/types from
  `@/lib/financials-data` instead. Reads Supabase when configured, else falls
  back to the seed. Never throws.
*/
export async function getAnnualReports(): Promise<FinancialsPayload> {
  const supabase = getSupabaseRead();
  if (!supabase) return SEED_PAYLOAD;
  try {
    // Public RLS already excludes soft-deleted rows; filter explicitly too so
    // the intent is clear and robust if the policy is ever loosened.
    const { data, error } = await supabase
      .from("annual_reports")
      .select("*")
      .eq("is_deleted", false);
    if (error || !data || data.length === 0) return SEED_PAYLOAD;
    return deriveFinancials(data.map(mapDbRow), "supabase");
  } catch {
    return SEED_PAYLOAD;
  }
}
