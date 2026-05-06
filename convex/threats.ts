import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("threatLogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);
  },
});

export const create = mutation({
  args: {
    severity: v.string(),
    source: v.string(),
    description: v.string(),
  },
  returns: v.id("threatLogs"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("threatLogs", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const existing = await ctx.db
      .query("threatLogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) return null;

    const threats = [
      { severity: "critical", source: "Port Scanner", description: "Open port 22 (SSH) detected with weak cipher suites on 192.168.1.105" },
      { severity: "high", source: "OSINT Module", description: "Email address found in breached database (Collection #5) — credential stuffing risk" },
      { severity: "medium", source: "Network Monitor", description: "Unusual outbound traffic to unknown IP 45.33.32.156 on port 8443" },
      { severity: "low", source: "DNS Analyzer", description: "DNS zone transfer allowed on ns1.target-domain.com — information disclosure" },
      { severity: "critical", source: "Vulnerability Scanner", description: "CVE-2024-3094 (XZ Utils backdoor) — affected package detected in system dependencies" },
      { severity: "high", source: "SSL Inspector", description: "TLS 1.0 still enabled on web server — POODLE attack vector present" },
      { severity: "medium", source: "Header Analyzer", description: "Missing Content-Security-Policy header on main application endpoint" },
      { severity: "low", source: "Subdomain Enum", description: "12 subdomains discovered via certificate transparency logs — 3 pointing to dev environments" },
    ];

    for (const t of threats) {
      await ctx.db.insert("threatLogs", {
        ...t,
        userId,
        createdAt: Date.now() - Math.random() * 86400000 * 7,
      });
    }
    return null;
  },
});
