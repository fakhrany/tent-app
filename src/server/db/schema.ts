import { relations, sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Enums
export const propertyTypeEnum = pgEnum("property_type", [
  "apartment",
  "villa",
  "penthouse",
  "townhouse",
  "twin",
  "studio",
]);

export const availabilityEnum = pgEnum("availability", [
  "available",
  "reserved",
  "sold",
]);

export const completionStatusEnum = pgEnum("completion_status", [
  "planning",
  "construction",
  "ready",
  "completed",
]);

export const viewTypeEnum = pgEnum("view_type", [
  "garden",
  "pool",
  "street",
  "city",
  "sea",
  "golf",
]);

export const facingEnum = pgEnum("facing", ["north", "south", "east", "west"]);

export const furnishingEnum = pgEnum("furnishing", [
  "unfurnished",
  "semi",
  "fully",
]);

// Developers table
export const developers = pgTable(
  "developers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    nameAr: varchar("name_ar", { length: 255 }),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    logo: text("logo"),
    country: varchar("country", { length: 100 }).notNull().default("Egypt"),
    website: text("website"),
    description: text("description"),
    descriptionAr: text("description_ar"),
    verified: boolean("verified").default(false),
    establishedYear: integer("established_year"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("developers_slug_idx").on(table.slug),
  }),
);

// Projects table
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    developerId: uuid("developer_id")
      .references(() => developers.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    nameAr: varchar("name_ar", { length: 255 }),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    city: varchar("city", { length: 100 }).notNull(),
    cityAr: varchar("city_ar", { length: 100 }),
    district: varchar("district", { length: 100 }).notNull(),
    districtAr: varchar("district_ar", { length: 100 }),
    lat: decimal("lat", { precision: 10, scale: 7 }).notNull(),
    lng: decimal("lng", { precision: 10, scale: 7 }).notNull(),
    deliveryDate: timestamp("delivery_date"),
    completionStatus: completionStatusEnum("completion_status").default("planning"),
    amenities: text("amenities").array(),
    amenitiesAr: text("amenities_ar").array(),
    description: text("description"),
    descriptionAr: text("description_ar"),
    masterPlan: text("master_plan"),
    images: text("images").array(),
    videoUrl: text("video_url"),
    totalUnits: integer("total_units").default(0),
    featured: boolean("featured").default(false),
    metadata: jsonb("metadata"),
    // For semantic search - vector embedding
    embedding: sql`vector(1536)`,
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("projects_slug_idx").on(table.slug),
    developerIdx: index("projects_developer_idx").on(table.developerId),
    cityIdx: index("projects_city_idx").on(table.city),
    locationIdx: sql`CREATE INDEX projects_location_idx ON ${table} USING gist ((point(lng, lat)))`,
    embeddingIdx: sql`CREATE INDEX projects_embedding_idx ON ${table} USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)`,
  }),
);

// Units table
export const units = pgTable(
  "units",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    unitNumber: varchar("unit_number", { length: 50 }),
    type: propertyTypeEnum("type").notNull(),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }).notNull(),
    sizeSqm: decimal("size_sqm", { precision: 10, scale: 2 }).notNull(),
    priceEgp: decimal("price_egp", { precision: 12, scale: 2 }).notNull(),
    priceUsd: decimal("price_usd", { precision: 12, scale: 2 }),
    currency: varchar("currency", { length: 3 }).default("EGP"),
    images: text("images").array(),
    floorPlan: text("floor_plan"),
    floor: integer("floor"),
    view: viewTypeEnum("view"),
    facing: facingEnum("facing"),
    furnishing: furnishingEnum("furnishing").default("unfurnished"),
    
    // Payment plan
    paymentPlan: jsonb("payment_plan").$type<{
      downPaymentPercent: number;
      installmentYears: number;
      installmentMonths: number;
      monthlyInstallment?: number;
      deliveryPayment?: number;
    }>(),
    
    availability: availabilityEnum("availability").default("available"),
    availableFrom: timestamp("available_from"),
    features: text("features").array(),
    featuresAr: text("features_ar").array(),
    
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  },
  (table) => ({
    projectIdx: index("units_project_idx").on(table.projectId),
    availabilityIdx: index("units_availability_idx").on(table.availability),
    priceIdx: index("units_price_idx").on(table.priceEgp),
    bedroomsIdx: index("units_bedrooms_idx").on(table.bedrooms),
    typeIdx: index("units_type_idx").on(table.type),
    projectAvailableIdx: index("units_project_available_idx").on(
      table.projectId,
      table.availability,
    ),
  }),
);

// Users table (for auth)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  role: varchar("role", { length: 50 }).default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
  isActive: boolean("is_active").default(true),
});

// Conversations table (for tracking chat sessions)
export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    sessionId: varchar("session_id", { length: 255 }),
    title: text("title"), // Auto-generated from first message
    messageCount: integer("message_count").default(0),
    lastMessageAt: timestamp("last_message_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("conversations_user_idx").on(table.userId),
    sessionIdx: index("conversations_session_idx").on(table.sessionId),
    createdAtIdx: index("conversations_created_at_idx").on(table.createdAt),
  }),
);

// Messages table (individual messages in conversations)
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),
    role: varchar("role", { length: 20 }).notNull(), // 'user' or 'assistant'
    content: text("content").notNull(),
    sources: jsonb("sources"), // Property results shown
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    conversationIdx: index("messages_conversation_idx").on(table.conversationId),
    createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
  }),
);

// Search logs (for analytics)
export const searchLogs = pgTable(
  "search_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    conversationId: uuid("conversation_id").references(() => conversations.id),
    query: text("query").notNull(),
    language: varchar("language", { length: 2 }).default("en"),
    filters: jsonb("filters"),
    resultCount: integer("result_count").default(0),
    clickedUnits: uuid("clicked_units").array(),
    sessionId: varchar("session_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("search_logs_user_idx").on(table.userId),
    conversationIdx: index("search_logs_conversation_idx").on(table.conversationId),
    createdAtIdx: index("search_logs_created_at_idx").on(table.createdAt),
  }),
);

// Relations
export const developersRelations = relations(developers, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  developer: one(developers, {
    fields: [projects.developerId],
    references: [developers.id],
  }),
  units: many(units),
}));

export const unitsRelations = relations(units, ({ one }) => ({
  project: one(projects, {
    fields: [units.projectId],
    references: [projects.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  searchLogs: many(searchLogs),
  conversations: many(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  messages: many(messages),
  searchLogs: many(searchLogs),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const searchLogsRelations = relations(searchLogs, ({ one }) => ({
  user: one(users, {
    fields: [searchLogs.userId],
    references: [users.id],
  }),
  conversation: one(conversations, {
    fields: [searchLogs.conversationId],
    references: [conversations.id],
  }),
}));

// Types
export type Developer = typeof developers.$inferSelect;
export type NewDeveloper = typeof developers.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export type User = typeof users.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type SearchLog = typeof searchLogs.$inferSelect;
