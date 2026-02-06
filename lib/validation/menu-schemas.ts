/**
 * Menu Validation Schemas - Zod schemas for menu data validation
 */

import { z } from "zod";

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  slug: z.string().min(1).max(100).optional(),
  enabled: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// Section Schema
export const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required").max(100),
  slug: z.string().min(1).max(100).optional(),
  categoryId: z.string().min(1, "Category is required"),
  enabled: z.boolean().default(true),
});

export type SectionInput = z.infer<typeof sectionSchema>;

// Menu Item Schema
export const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(200),
  description: z.string().max(500).optional(),
  categoryId: z.string().min(1, "Category is required"),
  sectionId: z.string().min(1, "Section is required"),
  basePrice: z.number().min(0, "Price must be positive"),
  image: z.string().url().optional().or(z.literal("")),
  available: z.boolean().default(true),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;

// Temporary Price Schema
export const temporaryPriceSchema = z.object({
  ruleName: z.string().min(1, "Rule name is required").max(100),
  temporaryPrice: z.number().min(0, "Price must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().optional(),
  endDate: z.string().min(1, "End date is required"),
  endTime: z.string().optional(),
  priority: z.number().min(0).max(100).optional(),
});

export type TemporaryPriceInput = z.infer<typeof temporaryPriceSchema>;

// Event Schema
export const eventSchema = z.object({
  name: z.string().min(1, "Event name is required").max(200),
  description: z.string().max(1000).optional(),
  startAt: z.string().datetime("Invalid start date/time"),
  endAt: z.string().datetime("Invalid end date/time"),
}).refine((data) => new Date(data.endAt) > new Date(data.startAt), {
  message: "End date must be after start date",
  path: ["endAt"],
});

export type EventInput = z.infer<typeof eventSchema>;

// Event Menu Price Schema
export const eventMenuPriceSchema = z.object({
  menuItemId: z.string().min(1, "Menu item is required"),
  temporaryPrice: z.number().min(0, "Price must be positive"),
});

export type EventMenuPriceInput = z.infer<typeof eventMenuPriceSchema>;
