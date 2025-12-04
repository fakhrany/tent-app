import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { users, conversations, messages, searchLogs } from '@/server/db/schema';
import { sql, count, desc, gte, and, isNotNull } from 'drizzle-orm';

export const analyticsRouter = createTRPCRouter({
  // ==================== USER METRICS ====================
  
  // Get total users count
  getTotalUsers: publicProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({ count: count() })
      .from(users);
    
    return result?.count || 0;
  }),

  // Get active users (logged in within last 30 days)
  getActiveUsers: publicProcedure
    .input(z.object({ 
      days: z.number().default(30) 
    }).optional())
    .query(async ({ ctx, input }) => {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - (input?.days || 30));
      
      const [result] = await ctx.db
        .select({ count: count() })
        .from(users)
        .where(
          and(
            gte(users.lastLoginAt, daysAgo),
            isNotNull(users.lastLoginAt)
          )
        );
      
      return result?.count || 0;
    }),

  // Get new users this month
  getNewUsers: publicProcedure.query(async ({ ctx }) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const [result] = await ctx.db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, startOfMonth));
    
    return result?.count || 0;
  }),

  // Get user growth over time
  getUserGrowth: publicProcedure
    .input(z.object({ 
      months: z.number().default(12) 
    }).optional())
    .query(async ({ ctx, input }) => {
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - (input?.months || 12));
      
      const result = await ctx.db
        .select({
          month: sql<string>`TO_CHAR(${users.createdAt}, 'YYYY-MM')`,
          count: count(),
        })
        .from(users)
        .where(gte(users.createdAt, monthsAgo))
        .groupBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`);
      
      return result;
    }),

  // ==================== CONVERSATION METRICS ====================
  
  // Get total conversations count
  getTotalConversations: publicProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({ count: count() })
      .from(conversations);
    
    return result?.count || 0;
  }),

  // Get active conversations (this month)
  getActiveConversations: publicProcedure
    .input(z.object({ 
      days: z.number().default(30) 
    }).optional())
    .query(async ({ ctx, input }) => {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - (input?.days || 30));
      
      const [result] = await ctx.db
        .select({ count: count() })
        .from(conversations)
        .where(gte(conversations.lastMessageAt, daysAgo));
      
      return result?.count || 0;
    }),

  // Get new conversations this month
  getNewConversations: publicProcedure.query(async ({ ctx }) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const [result] = await ctx.db
      .select({ count: count() })
      .from(conversations)
      .where(gte(conversations.createdAt, startOfMonth));
    
    return result?.count || 0;
  }),

  // Get conversation growth over time
  getConversationGrowth: publicProcedure
    .input(z.object({ 
      months: z.number().default(12) 
    }).optional())
    .query(async ({ ctx, input }) => {
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - (input?.months || 12));
      
      const result = await ctx.db
        .select({
          month: sql<string>`TO_CHAR(${conversations.createdAt}, 'YYYY-MM')`,
          count: count(),
        })
        .from(conversations)
        .where(gte(conversations.createdAt, monthsAgo))
        .groupBy(sql`TO_CHAR(${conversations.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${conversations.createdAt}, 'YYYY-MM')`);
      
      return result;
    }),

  // ==================== MESSAGE METRICS ====================
  
  // Get total messages count
  getTotalMessages: publicProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({ count: count() })
      .from(messages);
    
    return result?.count || 0;
  }),

  // Get average messages per conversation
  getAvgMessagesPerConversation: publicProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({ 
        avg: sql<number>`AVG(${conversations.messageCount})::numeric(10,2)` 
      })
      .from(conversations)
      .where(sql`${conversations.messageCount} > 0`);
    
    return parseFloat(result?.avg?.toString() || '0');
  }),

  // ==================== SEARCH METRICS ====================
  
  // Get total searches count
  getTotalSearches: publicProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({ count: count() })
      .from(searchLogs);
    
    return result?.count || 0;
  }),

  // Get popular search queries
  getPopularSearches: publicProcedure
    .input(z.object({ 
      limit: z.number().default(10) 
    }).optional())
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          query: searchLogs.query,
          count: count(),
        })
        .from(searchLogs)
        .groupBy(searchLogs.query)
        .orderBy(desc(count()))
        .limit(input?.limit || 10);
      
      return result;
    }),

  // Get search trends over time
  getSearchTrends: publicProcedure
    .input(z.object({ 
      days: z.number().default(30) 
    }).optional())
    .query(async ({ ctx, input }) => {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - (input?.days || 30));
      
      const result = await ctx.db
        .select({
          date: sql<string>`DATE(${searchLogs.createdAt})`,
          count: count(),
        })
        .from(searchLogs)
        .where(gte(searchLogs.createdAt, daysAgo))
        .groupBy(sql`DATE(${searchLogs.createdAt})`)
        .orderBy(sql`DATE(${searchLogs.createdAt})`);
      
      return result;
    }),

  // ==================== DASHBOARD OVERVIEW ====================
  
  // Get all key metrics for dashboard
  getOverview: publicProcedure.query(async ({ ctx }) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Total users
    const [totalUsers] = await ctx.db
      .select({ count: count() })
      .from(users);

    // Active users (last 30 days)
    const [activeUsers] = await ctx.db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          gte(users.lastLoginAt, thirtyDaysAgo),
          isNotNull(users.lastLoginAt)
        )
      );

    // New users this month
    const [newUsers] = await ctx.db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, startOfMonth));

    // Total conversations
    const [totalConversations] = await ctx.db
      .select({ count: count() })
      .from(conversations);

    // Active conversations (last 30 days)
    const [activeConversations] = await ctx.db
      .select({ count: count() })
      .from(conversations)
      .where(gte(conversations.lastMessageAt, thirtyDaysAgo));

    // New conversations this month
    const [newConversations] = await ctx.db
      .select({ count: count() })
      .from(conversations)
      .where(gte(conversations.createdAt, startOfMonth));

    // Total messages
    const [totalMessages] = await ctx.db
      .select({ count: count() })
      .from(messages);

    // Total searches
    const [totalSearches] = await ctx.db
      .select({ count: count() })
      .from(searchLogs);

    // Average messages per conversation
    const [avgMessages] = await ctx.db
      .select({ 
        avg: sql<number>`AVG(${conversations.messageCount})::numeric(10,2)` 
      })
      .from(conversations)
      .where(sql`${conversations.messageCount} > 0`);

    return {
      users: {
        total: totalUsers?.count || 0,
        active: activeUsers?.count || 0,
        new: newUsers?.count || 0,
      },
      conversations: {
        total: totalConversations?.count || 0,
        active: activeConversations?.count || 0,
        new: newConversations?.count || 0,
        avgMessages: parseFloat(avgMessages?.avg?.toString() || '0'),
      },
      messages: {
        total: totalMessages?.count || 0,
      },
      searches: {
        total: totalSearches?.count || 0,
      },
    };
  }),

  // ==================== USER TRACKING ====================
  
  // Track user login
  trackLogin: publicProcedure
    .input(z.object({ 
      userId: z.string().uuid() 
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(sql`${users.id} = ${input.userId}`);
      
      return { success: true };
    }),

  // ==================== CONVERSATION TRACKING ====================
  
  // Create new conversation
  createConversation: publicProcedure
    .input(z.object({
      userId: z.string().uuid().optional(),
      sessionId: z.string(),
      title: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [conversation] = await ctx.db
        .insert(conversations)
        .values({
          userId: input.userId,
          sessionId: input.sessionId,
          title: input.title,
          lastMessageAt: new Date(),
        })
        .returning();
      
      return conversation;
    }),

  // Add message to conversation
  addMessage: publicProcedure
    .input(z.object({
      conversationId: z.string().uuid(),
      role: z.enum(['user', 'assistant']),
      content: z.string(),
      sources: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Insert message
      const [message] = await ctx.db
        .insert(messages)
        .values({
          conversationId: input.conversationId,
          role: input.role,
          content: input.content,
          sources: input.sources,
        })
        .returning();

      // Update conversation
      await ctx.db
        .update(conversations)
        .set({
          messageCount: sql`${conversations.messageCount} + 1`,
          lastMessageAt: new Date(),
        })
        .where(sql`${conversations.id} = ${input.conversationId}`);

      return message;
    }),

  // Track search
  trackSearch: publicProcedure
    .input(z.object({
      userId: z.string().uuid().optional(),
      conversationId: z.string().uuid().optional(),
      query: z.string(),
      language: z.string().default('en'),
      resultCount: z.number().default(0),
      sessionId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [searchLog] = await ctx.db
        .insert(searchLogs)
        .values(input)
        .returning();
      
      return searchLog;
    }),
});
