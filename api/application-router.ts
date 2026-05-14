import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { applications, applicationDocuments } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const applicationRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        grantId: z.number(),
        // Personal Information
        fullName: z.string().min(1),
        dateOfBirth: z.string().min(1),
        phoneNumber: z.string().min(1),
        emailAddress: z.string().email(),
        residentialAddress: z.string().min(1),
        // Business Information
        businessName: z.string().optional(),
        businessType: z.string().optional(),
        businessRegistrationStatus: z.string().optional(),
        businessDescription: z.string().optional(),
        targetMarket: z.string().optional(),
        revenueStrategy: z.string().optional(),
        marketingPlan: z.string().optional(),
        budgetBreakdown: z.string().optional(),
        // Financial Information
        bankAccountDetails: z.string().optional(),
        currentIncome: z.string().optional(),
        expenses: z.string().optional(),
        existingFunding: z.string().optional(),
        // Personal Statement
        personalStatement: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(applications).values({
        grantId: input.grantId,
        fullName: input.fullName,
        dateOfBirth: input.dateOfBirth,
        phoneNumber: input.phoneNumber,
        emailAddress: input.emailAddress,
        residentialAddress: input.residentialAddress,
        businessName: input.businessName || null,
        businessType: input.businessType || null,
        businessRegistrationStatus: input.businessRegistrationStatus || null,
        businessDescription: input.businessDescription || null,
        targetMarket: input.targetMarket || null,
        revenueStrategy: input.revenueStrategy || null,
        marketingPlan: input.marketingPlan || null,
        budgetBreakdown: input.budgetBreakdown || null,
        bankAccountDetails: input.bankAccountDetails || null,
        currentIncome: input.currentIncome || null,
        expenses: input.expenses || null,
        existingFunding: input.existingFunding || null,
        personalStatement: input.personalStatement || null,
      });

      return { success: true, applicationId: Number(result[0].insertId) };
    }),

  addDocument: publicQuery
    .input(
      z.object({
        applicationId: z.number(),
        documentType: z.enum([
          "id_card",
          "passport_photo",
          "bank_statement",
          "business_registration",
          "proposal",
          "other",
        ]),
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number().optional(),
        mimeType: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(applicationDocuments).values({
        applicationId: input.applicationId,
        documentType: input.documentType,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        fileSize: input.fileSize || null,
        mimeType: input.mimeType || null,
      });
      return { success: true };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(applications)
        .where(eq(applications.id, input.id))
        .limit(1);

      if (!results[0]) return null;

      const docs = await db
        .select()
        .from(applicationDocuments)
        .where(eq(applicationDocuments.applicationId, input.id));

      return { ...results[0], documents: docs };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    const results = await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt));
    return results;
  }),
});
