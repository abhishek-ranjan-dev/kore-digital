import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

/*
  Backstop cleanup for the admin "staged upload" flow (see staging-types.ts).

  Extraction deletes its staged PDF immediately and a successful submit MOVES it
  out of staging, so the only way an object lingers under `_staging/` is a client
  that died mid-operation. This route (run daily by Vercel Cron — see
  vercel.json) sweeps any staged object older than 24h from both buckets, so no
  orphan is ever permanent.

  Auth: when CRON_SECRET is set, Vercel Cron sends it as a Bearer token; we
  reject anything else. It uses the service-role key, so it must never be public.
*/
export const dynamic = "force-dynamic";

const BUCKETS = ["annual-reports", "policies"] as const;
const STAGING_PREFIX = "_staging";
const STALE_MS = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    if (request.headers.get("authorization") !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const cutoff = Date.now() - STALE_MS;
  const removed: Record<string, number> = {};

  for (const bucket of BUCKETS) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(STAGING_PREFIX, { limit: 1000 });
    if (error || !data) {
      removed[bucket] = 0;
      continue;
    }
    const stale = data
      .filter((o) => {
        const ts = o.created_at ?? o.updated_at;
        return ts ? new Date(ts).getTime() < cutoff : false;
      })
      .map((o) => `${STAGING_PREFIX}/${o.name}`);
    if (stale.length) {
      await supabase.storage.from(bucket).remove(stale);
    }
    removed[bucket] = stale.length;
  }

  return NextResponse.json({ ok: true, removed });
}
