import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { developers, projects, units } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

// ==================== DEVELOPERS ====================

const developerSchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().min(1),
  slug: z.string().min(1),
  country: z.string(),
  establishedYear: z.number(),
  website: z.string().url(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  description: z.string(),
  descriptionAr: z.string().optional(),
  logo: z.string().optional(),
  verified: z.boolean().default(false),
});

// ==================== PROJECTS ====================

const projectSchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().min(1),
  slug: z.string().min(1),
  developerId: z.string().uuid(),
  city: z.string().min(1),
  cityAr: z.string().optional(),
  district: z.string().min(1),
  districtAr: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  deliveryDate: z.string(), // Date string
  completionStatus: z.enum(['planning', 'construction', 'ready', 'completed']),
  totalUnits: z.number().min(1),
  amenities: z.array(z.string()),
  amenitiesAr: z.array(z.string()),
  description: z.string(),
  descriptionAr: z.string().optional(),
  masterPlan: z.string().optional(),
  images: z.array(z.string()),
  videoUrl: z.string().optional(),
  featured: z.boolean().default(false),
});

// ==================== UNITS ====================

const paymentPlanSchema = z.object({
  downPaymentPercent: z.number(),
  installmentYears: z.number().optional(),
  installmentMonths: z.number().optional(),
  monthlyInstallment: z.number().optional(),
  deliveryPayment: z.number().optional(),
});

const unitSchema = z.object({
  unitNumber: z.string().min(1),
  projectId: z.string().uuid(),
  type: z.enum(['apartment', 'villa', 'penthouse', 'townhouse', 'twin', 'studio']),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  sizeSqm: z.number().min(1),
  priceEgp: z.number().min(0),
  priceUsd: z.number().optional(),
  currency: z.enum(['EGP', 'USD']).default('EGP'),
  paymentPlan: paymentPlanSchema,
  floor: z.number().optional(),
  view: z.enum(['garden', 'pool', 'street', 'city', 'sea', 'golf']).optional(),
  facing: z.enum(['north', 'south', 'east', 'west']).optional(),
  furnishing: z.enum(['unfurnished', 'semi', 'fully']).optional(),
  availability: z.enum(['available', 'reserved', 'sold']).default('available'),
  availableFrom: z.string().optional(), // Date string
  features: z.array(z.string()),
  featuresAr: z.array(z.string()),
  images: z.array(z.string()),
  floorPlan: z.string().optional(),
});

export const adminRouter = createTRPCRouter({
  // ==================== DEVELOPERS ====================
  
  // Create developer
  createDeveloper: publicProcedure
    .input(developerSchema)
    .mutation(async ({ ctx, input }) => {
      const [developer] = await ctx.db.insert(developers).values(input).returning();
      return developer;
    }),

  // Update developer
  updateDeveloper: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: developerSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [developer] = await ctx.db
        .update(developers)
        .set({ ...input.data, updatedAt: new Date() })
        .where(eq(developers.id, input.id))
        .returning();
      return developer;
    }),

  // Delete developer
  deleteDeveloper: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(developers).where(eq(developers.id, input.id));
      return { success: true };
    }),

  // Get all developers
  getDevelopers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(developers);
  }),

  // Get single developer
  getDeveloper: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [developer] = await ctx.db
        .select()
        .from(developers)
        .where(eq(developers.id, input.id));
      return developer;
    }),

  // ==================== PROJECTS ====================
  
  // Create project
  createProject: publicProcedure
    .input(projectSchema)
    .mutation(async ({ ctx, input }) => {
      const [project] = await ctx.db.insert(projects).values({
        ...input,
        lat: input.lat ? parseFloat(input.lat) : null,
        lng: input.lng ? parseFloat(input.lng) : null,
      }).returning();
      return project;
    }),

  // Update project
  updateProject: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: projectSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updateData = { ...input.data };
      if (input.data.lat) updateData.lat = parseFloat(input.data.lat);
      if (input.data.lng) updateData.lng = parseFloat(input.data.lng);
      
      const [project] = await ctx.db
        .update(projects)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(projects.id, input.id))
        .returning();
      return project;
    }),

  // Delete project
  deleteProject: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(projects).where(eq(projects.id, input.id));
      return { success: true };
    }),

  // Get all projects
  getProjects: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(projects);
  }),

  // Get projects by developer
  getProjectsByDeveloper: publicProcedure
    .input(z.object({ developerId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.developerId, input.developerId));
    }),

  // ==================== UNITS ====================
  
  // Create unit
  createUnit: publicProcedure
    .input(unitSchema)
    .mutation(async ({ ctx, input }) => {
      const [unit] = await ctx.db.insert(units).values(input).returning();
      return unit;
    }),

  // Update unit
  updateUnit: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: unitSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [unit] = await ctx.db
        .update(units)
        .set({ ...input.data, updatedAt: new Date() })
        .where(eq(units.id, input.id))
        .returning();
      return unit;
    }),

  // Delete unit
  deleteUnit: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(units).where(eq(units.id, input.id));
      return { success: true };
    }),

  // Get all units
  getUnits: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(units);
  }),

  // Get units by project
  getUnitsByProject: publicProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(units)
        .where(eq(units.projectId, input.projectId));
    }),

  // ==================== STATS ====================
  
  // Get dashboard stats
  getStats: publicProcedure.query(async ({ ctx }) => {
    const [developersCount] = await ctx.db.select({ count: developers.id }).from(developers);
    const [projectsCount] = await ctx.db.select({ count: projects.id }).from(projects);
    const [unitsCount] = await ctx.db.select({ count: units.id }).from(units);
    
    return {
      developers: developersCount?.count || 0,
      projects: projectsCount?.count || 0,
      units: unitsCount?.count || 0,
    };
  }),
});
