import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { units, projects, developers } from "@/server/db/schema";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
import { generateText, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { env } from "@/lib/env";

export const chatRouter = createTRPCRouter({
  query: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        language: z.enum(["en", "ar"]).default("en"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Extract filters from query using AI
      const model = env.ANTHROPIC_API_KEY
        ? anthropic("claude-sonnet-4-20250514")
        : openai("gpt-4-turbo");

      const { text: filtersText } = await generateText({
        model,
        prompt: `Extract search filters from this real estate query. Return JSON only.
        
Query: "${input.query}"

Extract:
- location: array of cities/districts (e.g., ["New Cairo", "6th October"])
- minPrice: number in EGP (null if not specified)
- maxPrice: number in EGP (null if not specified)
- bedrooms: number (null if not specified)
- propertyType: array (e.g., ["apartment", "villa"])

Return only valid JSON, no other text:
{"location":[],"minPrice":null,"maxPrice":null,"bedrooms":null,"propertyType":[]}`,
        temperature: 0.1,
        maxTokens: 200,
      });

      let filters: any = {
        location: [],
        minPrice: null,
        maxPrice: null,
        bedrooms: null,
        propertyType: [],
      };

      try {
        const cleaned = filtersText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        filters = JSON.parse(cleaned);
      } catch {
        console.warn("Failed to parse filters, using defaults");
      }

      // 2. Query database
      let whereConditions: any[] = [eq(units.availability, "available")];

      if (filters.bedrooms) {
        whereConditions.push(eq(units.bedrooms, filters.bedrooms));
      }

      if (filters.minPrice) {
        whereConditions.push(gte(units.priceEgp, String(filters.minPrice)));
      }

      if (filters.maxPrice) {
        whereConditions.push(lte(units.priceEgp, String(filters.maxPrice)));
      }

      const results = await ctx.db
        .select({
          unit: units,
          project: projects,
          developer: developers,
        })
        .from(units)
        .leftJoin(projects, eq(units.projectId, projects.id))
        .leftJoin(developers, eq(projects.developerId, developers.id))
        .where(and(...whereConditions))
        .orderBy(desc(projects.featured), units.priceEgp)
        .limit(10);

      // Filter by location if specified
      let filteredResults = results;
      if (filters.location && filters.location.length > 0) {
        filteredResults = results.filter((r) =>
          filters.location.some((loc: string) =>
            r.project?.city?.toLowerCase().includes(loc.toLowerCase()) ||
            r.project?.district?.toLowerCase().includes(loc.toLowerCase())
          )
        );
      }

      // 3. Generate AI response
      const contextText = filteredResults
        .map(
          (r, idx) =>
            `[${idx + 1}] ${input.language === "en" ? r.project?.name : r.project?.nameAr || r.project?.name} in ${input.language === "en" ? r.project?.city : r.project?.cityAr || r.project?.city} by ${r.developer?.name}: ${r.unit.bedrooms}BR/${r.unit.bathrooms}BA, ${r.unit.sizeSqm}m², ${parseFloat(r.unit.priceEgp).toLocaleString()} EGP. ${r.project?.description || ""}`,
        )
        .join("\n\n");

      const systemPrompt =
        input.language === "en"
          ? "You are a helpful real estate assistant. Answer questions about properties using the provided context. Always cite sources using [1], [2], [3] format. Be concise and accurate. Format prices in millions (M) for readability."
          : "أنت مساعد عقاري مفيد. أجب عن الأسئلة حول العقارات باستخدام السياق المقدم. استشهد دائماً بالمصادر باستخدام [١], [٢], [٣]. كن موجزاً ودقيقاً.";

      const { text: answer } = await generateText({
        model,
        system: systemPrompt,
        prompt: `Context:\n${contextText}\n\nQuestion: ${input.query}\n\nProvide a helpful answer with citations.`,
        maxTokens: 500,
        temperature: 0.7,
      });

      // 4. Return response with sources and map pins
      return {
        answer,
        sources: filteredResults.slice(0, 3).map((r) => ({
          id: r.unit.id,
          name: input.language === "en" ? r.project?.name : r.project?.nameAr || r.project?.name,
          location: input.language === "en" ? r.project?.city : r.project?.cityAr || r.project?.city,
          price: r.unit.priceEgp,
          bedrooms: r.unit.bedrooms,
          bathrooms: r.unit.bathrooms,
          size: r.unit.sizeSqm,
        })),
        mapPins: filteredResults.map((r) => ({
          id: r.unit.id,
          lat: parseFloat(r.project?.lat || "0"),
          lng: parseFloat(r.project?.lng || "0"),
          name: input.language === "en" ? r.project?.name : r.project?.nameAr || r.project?.name,
          price: r.unit.priceEgp,
          bedrooms: r.unit.bedrooms,
          type: r.unit.type,
        })),
      };
    }),
});
