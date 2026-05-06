import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  scanResults: defineTable({
    userId: v.id("users"),
    type: v.string(),
    target: v.string(),
    results: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
  threatLogs: defineTable({
    userId: v.id("users"),
    severity: v.string(),
    source: v.string(),
    description: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});

export default schema;
