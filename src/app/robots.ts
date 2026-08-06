import type { MetadataRoute } from "next";

/*
  /robots.txt — the public site is crawlable, but /admin is off-limits to
  search engines AND to AI / AEO crawlers (ChatGPT, Claude, Perplexity, Google
  AI, etc.). Listing the AI user-agents explicitly ensures the ones that read
  their own UA rules also honour the exclusion.
*/
const DISALLOW_ADMIN = ["/admin", "/admin/"];

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
  "Meta-ExternalAgent",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Every crawler may index the public site, but never /admin.
      { userAgent: "*", allow: "/", disallow: DISALLOW_ADMIN },
      // AI / AEO crawlers — same exclusion, stated per user-agent.
      { userAgent: AI_BOTS, allow: "/", disallow: DISALLOW_ADMIN },
    ],
  };
}
