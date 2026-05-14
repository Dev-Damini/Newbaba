import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  json,
  decimal,
} from "drizzle-orm/mysql-core";

// Users table (from auth)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Grants table - stores all available grant programs
export const grants = mysqlTable("grants", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", [
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
  ]).notNull(),
  fundingAmount: decimal("fundingAmount", { precision: 15, scale: 2 }).notNull(),
  fundingType: mysqlEnum("fundingType", ["federal", "state", "private", "corporate"]).notNull(),
  eligibility: text("eligibility").notNull(),
  deadline: varchar("deadline", { length: 100 }),
  processingTime: varchar("processingTime", { length: 100 }).default("2-4 weeks"),
  isActive: mysqlEnum("isActive", ["active", "inactive", "closed"]).default("active").notNull(),
  isInstantFunding: mysqlEnum("isInstantFunding", ["yes", "no"]).default("no").notNull(),
  requirements: json("requirements").$type<string[]>(),
  applicationUrl: varchar("applicationUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Grant = typeof grants.$inferSelect;
export type InsertGrant = typeof grants.$inferInsert;

// Grant applications table
export const applications = mysqlTable("applications", {
  id: serial("id").primaryKey(),
  grantId: bigint("grantId", { mode: "number", unsigned: true }).notNull(),
  // Personal Information
  fullName: varchar("fullName", { length: 255 }).notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 50 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 50 }).notNull(),
  emailAddress: varchar("emailAddress", { length: 320 }).notNull(),
  residentialAddress: text("residentialAddress").notNull(),
  // Business Information
  businessName: varchar("businessName", { length: 255 }),
  businessType: varchar("businessType", { length: 100 }),
  businessRegistrationStatus: varchar("businessRegistrationStatus", { length: 100 }),
  businessDescription: text("businessDescription"),
  targetMarket: text("targetMarket"),
  revenueStrategy: text("revenueStrategy"),
  marketingPlan: text("marketingPlan"),
  budgetBreakdown: text("budgetBreakdown"),
  // Financial Information
  bankAccountDetails: text("bankAccountDetails"),
  currentIncome: varchar("currentIncome", { length: 100 }),
  expenses: text("expenses"),
  existingFunding: text("existingFunding"),
  // Personal Statement
  personalStatement: text("personalStatement"),
  // Status
  status: mysqlEnum("status", ["pending", "reviewing", "approved", "rejected"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

// Application documents table (uploaded files)
export const applicationDocuments = mysqlTable("applicationDocuments", {
  id: serial("id").primaryKey(),
  applicationId: bigint("applicationId", { mode: "number", unsigned: true }).notNull(),
  documentType: mysqlEnum("documentType", [
    "id_card",
    "passport_photo",
    "bank_statement",
    "business_registration",
    "proposal",
    "other",
  ]).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: bigint("fileSize", { mode: "number", unsigned: true }),
  mimeType: varchar("mimeType", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ApplicationDocument = typeof applicationDocuments.$inferSelect;
export type InsertApplicationDocument = typeof applicationDocuments.$inferInsert;

// Admin sessions table (for admin code authentication)
export const adminSessions = mysqlTable("adminSessions", {
  id: serial("id").primaryKey(),
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
  isActive: mysqlEnum("isActive", ["yes", "no"]).default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export type AdminSession = typeof adminSessions.$inferSelect;

// Contact messages table
export const contactMessages = mysqlTable("contactMessages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: mysqlEnum("isRead", ["yes", "no"]).default("no").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
