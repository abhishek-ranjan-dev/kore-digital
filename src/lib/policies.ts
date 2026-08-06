import { getSupabaseRead } from "@/lib/supabase/server";
import {
  derivePolicies,
  mapPolicyRow,
  SEED_POLICIES_PAYLOAD,
  type PoliciesPayload,
} from "@/lib/policies-data";

/*
  Server-only statutory-policy reads. Keeps the Supabase client out of any
  client bundle — client components import the pure seed/types from
  `@/lib/policies-data` instead. Reads Supabase when configured, else falls
  back to the seed. Never throws.
*/
export async function getPolicies(): Promise<PoliciesPayload> {
  const supabase = getSupabaseRead();
  if (!supabase) return SEED_POLICIES_PAYLOAD;
  try {
    const { data, error } = await supabase
      .from("policy_documents")
      .select(
        "title, mandatory_under, pdf_url, sort_order, policy_categories(name, sort_order)"
      )
      .eq("is_deleted", false);
    if (error || !data || data.length === 0) return SEED_POLICIES_PAYLOAD;
    return derivePolicies(data.map(mapPolicyRow), "supabase");
  } catch {
    return SEED_POLICIES_PAYLOAD;
  }
}
