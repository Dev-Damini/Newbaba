import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { grants, applications, applicationDocuments, adminSessions } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { SignJWT, jwtVerify } from "jose";

const ADMIN_CODE = "3207835715";
const ADMIN_JWT_SECRET = new TextEncoder().encode("platinum-grant-admin-secret-key-2024");

async function createAdminToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(ADMIN_JWT_SECRET);
}

async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET, {
      clockTolerance: 60,
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const adminRouter = createRouter({
  login: publicQuery
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      if (input.code !== ADMIN_CODE) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid admin code",
        });
      }

      const token = await createAdminToken();
      const db = getDb();

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await db.insert(adminSessions).values({
        sessionToken: token,
        expiresAt,
      });

      return { success: true, token };
    }),

  verify: publicQuery
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const isValid = await verifyAdminToken(input.token);
      return { valid: isValid };
    }),

  // Grant management
  createGrant: publicQuery
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        category: z.enum([
          "business",
          "education",
          "personal",
          "emergency",
          "housing",
          "healthcare",
          "technology",
          "agriculture",
          "community",
          "research",
          "arts",
          "nonprofit",
        ]),
        fundingAmount: z.string().min(1),
        fundingType: z.enum(["federal", "state", "private", "corporate"]),
        eligibility: z.string().min(1),
        deadline: z.string().optional(),
        processingTime: z.string().optional(),
        isActive: z.enum(["active", "inactive", "closed"]).default("active"),
        isInstantFunding: z.enum(["yes", "no"]).default("no"),
        requirements: z.array(z.string()).optional(),
        applicationUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(grants).values({
        title: input.title,
        description: input.description,
        category: input.category,
        fundingAmount: input.fundingAmount,
        fundingType: input.fundingType,
        eligibility: input.eligibility,
        deadline: input.deadline || null,
        processingTime: input.processingTime || "2-4 weeks",
        isActive: input.isActive,
        isInstantFunding: input.isInstantFunding,
        requirements: input.requirements || null,
        applicationUrl: input.applicationUrl || null,
      });
      return { success: true, grantId: Number(result[0].insertId) };
    }),

  updateGrant: publicQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().min(1),
        category: z.enum([
          "business",
          "education",
          "personal",
          "emergency",
          "housing",
          "healthcare",
          "technology",
          "agriculture",
          "community",
          "research",
          "arts",
          "nonprofit",
        ]),
        fundingAmount: z.string().min(1),
        fundingType: z.enum(["federal", "state", "private", "corporate"]),
        eligibility: z.string().min(1),
        deadline: z.string().optional(),
        processingTime: z.string().optional(),
        isActive: z.enum(["active", "inactive", "closed"]),
        isInstantFunding: z.enum(["yes", "no"]),
        requirements: z.array(z.string()).optional(),
        applicationUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(grants)
        .set({
          title: input.title,
          description: input.description,
          category: input.category,
          fundingAmount: input.fundingAmount,
          fundingType: input.fundingType,
          eligibility: input.eligibility,
          deadline: input.deadline || null,
          processingTime: input.processingTime || "2-4 weeks",
          isActive: input.isActive,
          isInstantFunding: input.isInstantFunding,
          requirements: input.requirements || null,
          applicationUrl: input.applicationUrl || null,
          updatedAt: new Date(),
        })
        .where(eq(grants.id, input.id));
      return { success: true };
    }),

  deleteGrant: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(grants).where(eq(grants.id, input.id));
      return { success: true };
    }),

  // Application management
  listApplications: publicQuery.query(async () => {
    const db = getDb();
    const results = await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt));
    return results;
  }),

  getApplicationDetails: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const appResults = await db
        .select()
        .from(applications)
        .where(eq(applications.id, input.id))
        .limit(1);

      if (!appResults[0]) return null;

      const docs = await db
        .select()
        .from(applicationDocuments)
        .where(eq(applicationDocuments.applicationId, input.id));

      return { ...appResults[0], documents: docs };
    }),

  updateApplicationStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "reviewing", "approved", "rejected"]),
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(applications)
        .set({
          status: input.status,
          adminNotes: input.adminNotes || null,
          updatedAt: new Date(),
        })
        .where(eq(applications.id, input.id));
      return { success: true };
    }),

  // Dashboard stats
  getDashboardStats: publicQuery.query(async () => {
    const db = getDb();
    const allGrants = await db.select().from(grants);
    const allApplications = await db.select().from(applications);
    const activeGrants = allGrants.filter((g) => g.isActive === "active");
    const totalFunding = activeGrants.reduce(
      (sum, g) => sum + Number(g.fundingAmount),
      0
    );
    const pendingApplications = allApplications.filter(
      (a) => a.status === "pending"
    );
    const approvedApplications = allApplications.filter(
      (a) => a.status === "approved"
    );

    return {
      totalGrants: allGrants.length,
      activeGrants: activeGrants.length,
      totalFunding: totalFunding,
      totalApplications: allApplications.length,
      pendingApplications: pendingApplications.length,
      approvedApplications: approvedApplications.length,
      recentApplications: allApplications.slice(0, 10),
    };
  }),

  listAllGrants: publicQuery.query(async () => {
    const db = getDb();
    const results = await db
      .select()
      .from(grants)
      .orderBy(desc(grants.createdAt));
    return results;
  }),
});
