import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { grants } from "@db/schema";
import { eq, and, desc, like, or } from "drizzle-orm";

export const grantRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          category: z.string().optional(),
          fundingType: z.string().optional(),
          search: z.string().optional(),
          isActive: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.category) {
        conditions.push(eq(grants.category, input.category as any));
      }
      if (input?.fundingType) {
        conditions.push(eq(grants.fundingType, input.fundingType as any));
      }
      if (input?.isActive) {
        conditions.push(eq(grants.isActive, input.isActive as any));
      } else {
        // Default: show only active grants
        conditions.push(eq(grants.isActive, "active"));
      }

      if (input?.search) {
        const searchTerm = `%${input.search}%`;
        conditions.push(
          or(
            like(grants.title, searchTerm),
            like(grants.description, searchTerm),
            like(grants.category, searchTerm)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await db
        .select()
        .from(grants)
        .where(whereClause)
        .orderBy(desc(grants.fundingAmount));

      return results;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(grants)
        .where(eq(grants.id, input.id))
        .limit(1);
      return results[0] || null;
    }),

  getStats: publicQuery.query(async () => {
    const db = getDb();
    const allGrants = await db.select().from(grants);

    const activeGrants = allGrants.filter((g) => g.isActive === "active");
    const totalFunding = activeGrants.reduce(
      (sum, g) => sum + Number(g.fundingAmount),
      0
    );

    return {
      totalGrants: allGrants.length,
      activeGrants: activeGrants.length,
      totalFunding: totalFunding,
    };
  }),
});
