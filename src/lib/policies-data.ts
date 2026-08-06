import { policyDocuments } from "@/data/governance";

/*
  Pure statutory-policy helpers — NO Supabase import, safe for client
  components. Holds the types, the seed groups (fallback when Supabase is
  unconfigured), and the derivation that turns raw `policy_documents` rows
  (joined to their category) into the grouped shape the IR page renders.
  The server-only Supabase read lives in `@/lib/policies`.
*/

/** A single policy card. */
export interface PolicyItem {
  title: string;
  mandatoryUnder: string;
  fileUrl: string;
}

/** A category heading with its policies, in display order. */
export interface PolicyGroup {
  category: string;
  policies: PolicyItem[];
}

export interface PoliciesPayload {
  groups: PolicyGroup[];
  count: number;
  source: "supabase" | "seed";
}

/** Mirrors a `policy_documents` row joined to `policy_categories`. */
export interface RawPolicyRow {
  title: string;
  category: string;
  categorySortOrder: number;
  mandatoryUnder: string | null;
  fileUrl: string;
  sortOrder: number;
}

/* ── Seed taxonomy (fallback only) ───────────────────────────────────────
   The 3 categories in display order, and the keyword rules that slot each
   hardcoded governance.ts policy into one. Kept in sync with the SQL seed in
   0002_policy_documents.sql; used only when Supabase is unconfigured. */
export const SEED_CATEGORIES = [
  "Core Governance & Conduct",
  "Operations & Materiality",
  "Securities Compliance",
] as const;

const SEED_KEYWORDS: Record<(typeof SEED_CATEGORIES)[number], string[]> = {
  "Core Governance & Conduct": [
    "Code of Conduct for Senior Management",
    "Code of Conduct for Independent Directors",
    "Nomination & Remuneration",
    "Related Party Transaction",
  ],
  "Operations & Materiality": [
    "Vigil Mechanism",
    "Whistle",
    "Risk Management",
    "Preservation of Documents",
    "Prevention of Sexual Harassment",
  ],
  "Securities Compliance": ["Insider Trading", "Materiality of Events"],
};

const SEED_ROWS: RawPolicyRow[] = (() => {
  const rows: RawPolicyRow[] = [];
  policyDocuments.forEach((p, i) => {
    const category = SEED_CATEGORIES.find((cat) =>
      SEED_KEYWORDS[cat].some((k) =>
        p.title.toLowerCase().includes(k.toLowerCase())
      )
    );
    if (!category) return;
    rows.push({
      title: p.title,
      category,
      categorySortOrder: SEED_CATEGORIES.indexOf(category),
      mandatoryUnder: p.mandatoryUnder,
      fileUrl: p.fileUrl,
      sortOrder: i,
    });
  });
  return rows;
})();

/* ── Derivation ──────────────────────────────────────────────────────── */

export function derivePolicies(
  rows: RawPolicyRow[],
  source: "supabase" | "seed"
): PoliciesPayload {
  // Group by category, remembering each category's sort order.
  const byCategory = new Map<
    string,
    { sortOrder: number; policies: RawPolicyRow[] }
  >();
  for (const r of rows) {
    const bucket = byCategory.get(r.category);
    if (bucket) bucket.policies.push(r);
    else byCategory.set(r.category, { sortOrder: r.categorySortOrder, policies: [r] });
  }

  const groups: PolicyGroup[] = [...byCategory.entries()]
    .sort(
      (a, b) => a[1].sortOrder - b[1].sortOrder || a[0].localeCompare(b[0])
    )
    .map(([category, { policies }]) => ({
      category,
      policies: [...policies]
        .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
        .map((p) => ({
          title: p.title,
          mandatoryUnder: p.mandatoryUnder ?? "",
          fileUrl: p.fileUrl,
        })),
    }));

  const count = groups.reduce((n, g) => n + g.policies.length, 0);
  return { groups, count, source };
}

/** Synchronous seed payload — the client's initial state. */
export const SEED_POLICIES_PAYLOAD: PoliciesPayload = derivePolicies(
  SEED_ROWS,
  "seed"
);

/** Maps a raw DB row (with joined category) to `RawPolicyRow`. Pure. */
export function mapPolicyRow(r: Record<string, unknown>): RawPolicyRow {
  // Supabase returns the joined category either as an object or a 1-element
  // array depending on the relationship shape — normalise both.
  const cat = r.policy_categories as
    | { name?: unknown; sort_order?: unknown }
    | { name?: unknown; sort_order?: unknown }[]
    | null
    | undefined;
  const catObj = Array.isArray(cat) ? cat[0] : cat;
  return {
    title: String(r.title),
    category: catObj?.name != null ? String(catObj.name) : "Uncategorised",
    categorySortOrder:
      catObj?.sort_order != null ? Number(catObj.sort_order) : 999,
    mandatoryUnder: r.mandatory_under ? String(r.mandatory_under) : null,
    fileUrl: String(r.pdf_url),
    sortOrder: r.sort_order != null ? Number(r.sort_order) : 0,
  };
}
