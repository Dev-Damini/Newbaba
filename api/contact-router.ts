import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contactMessages } from "@db/schema";
import { desc } from "drizzle-orm";

export const contactRouter = createRouter({
  send: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().min(1),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(contactMessages).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject,
        message: input.message,
      });
      return { success: true };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    const results = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
    return results;
  }),
});
