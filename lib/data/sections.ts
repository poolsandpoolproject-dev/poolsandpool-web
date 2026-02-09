/**
 * Dummy Sections Data
 * Will be replaced with API calls when backend is ready
 */

export interface Section {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  imageUrl?: string;
  enabled: boolean;
}

// In-memory store (will be replaced with API)
let sectionsStore: Section[] = [
  {
    id: "s1",
    name: "Small Chops",
    slug: "small-chops",
    categoryId: "1",
    description: "Finger foods and light bites",
    imageUrl: "",
    enabled: true,
  },
  {
    id: "s2",
    name: "Grills & BBQ",
    slug: "grills-bbq",
    categoryId: "1",
    description: "Grilled meats and BBQ platters",
    imageUrl: "",
    enabled: true,
  },
  {
    id: "s3",
    name: "Main Dishes",
    slug: "main-dishes",
    categoryId: "1",
    description: "Hearty mains for full meals",
    imageUrl: "/main.jpg",
    enabled: true,
  },
  {
    id: "s4",
    name: "Sides",
    slug: "sides",
    categoryId: "1",
    description: "Sides to complement your meal",
    imageUrl: "",
    enabled: true,
  },
  {
    id: "s5",
    name: "Platters",
    slug: "platters",
    categoryId: "1",
    description: "Sharing platters for groups",
    imageUrl: "",
    enabled: true,
  },
  {
    id: "s6",
    name: "Signature Cocktails",
    slug: "signature-cocktails",
    categoryId: "2",
    description: "House special cocktails",
    imageUrl: "/images/sections/signature-cocktails.jpg",
    enabled: true,
  },
  {
    id: "s7",
    name: "Classic Cocktails",
    slug: "classic-cocktails",
    categoryId: "2",
    description: "All-time cocktail favorites",
    imageUrl: "/images/sections/classic-cocktails.jpg",
    enabled: true,
  },
  {
    id: "s8",
    name: "Beers & Ciders",
    slug: "beers-ciders",
    categoryId: "2",
    description: "Beers and refreshing ciders",
    imageUrl: "/images/sections/beers-ciders.jpg",
    enabled: true,
  },
  {
    id: "s9",
    name: "Wines",
    slug: "wines",
    categoryId: "2",
    description: "Red, white and sparkling wines",
    imageUrl: "/images/sections/wines.jpg",
    enabled: true,
  },
  {
    id: "s10",
    name: "Spirits",
    slug: "spirits",
    categoryId: "2",
    description: "Vodka, gin, whisky and more",
    imageUrl: "/images/sections/spirits.jpg",
    enabled: true,
  },
  {
    id: "s11",
    name: "Non-Alcoholic",
    slug: "non-alcoholic",
    categoryId: "2",
    description: "Mocktails, juices and sodas",
    imageUrl: "/images/sections/non-alcoholic.jpg",
    enabled: true,
  },
  {
    id: "s12",
    name: "Shisha",
    slug: "shisha",
    categoryId: "3",
    description: "Flavoured shisha options",
    imageUrl: "/images/sections/shisha.jpg",
    enabled: true,
  },
  {
    id: "s13",
    name: "Cigars",
    slug: "cigars",
    categoryId: "3",
    description: "Premium cigars selection",
    imageUrl: "/images/sections/cigars.jpg",
    enabled: true,
  },
  {
    id: "s14",
    name: "Cigarettes",
    slug: "cigarettes",
    categoryId: "3",
    description: "Cigarette options",
    imageUrl: "/images/sections/cigarettes.jpg",
    enabled: true,
  },
];

/**
 * Generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Get all sections
 */
export function getAllSections(): Section[] {
  return [...sectionsStore];
}

/**
 * Get section by ID
 */
export function getSectionById(id: string): Section | undefined {
  return sectionsStore.find((section) => section.id === id);
}

/**
 * Get sections by category ID
 */
export function getSectionsByCategoryId(categoryId: string): Section[] {
  return sectionsStore.filter((s) => s.categoryId === categoryId && s.enabled);
}

/**
 * Get sections by category slug
 */
export function getSectionsByCategorySlug(categorySlug: string, categories: { id: string; slug: string }[]): Section[] {
  const category = categories.find((cat) => cat.slug === categorySlug);
  if (!category) return [];
  return getSectionsByCategoryId(category.id);
}

/**
 * Get all enabled sections
 */
export function getEnabledSections(): Section[] {
  return sectionsStore.filter((s) => s.enabled);
}

/**
 * Create a new section
 */
export function createSection(
  name: string,
  categoryId: string,
  enabled: boolean = true,
  description?: string,
  imageUrl?: string
): Section {
  const slug = generateSlug(name);
  const id = `s${Date.now()}`;
  const newSection: Section = {
    id,
    name,
    slug,
    categoryId,
    description,
    imageUrl,
    enabled,
  };
  sectionsStore.push(newSection);
  return newSection;
}

/**
 * Update a section
 */
export function updateSection(
  id: string,
  updates: Partial<Omit<Section, "id" | "slug">>
): Section | null {
  const index = sectionsStore.findIndex((section) => section.id === id);
  if (index === -1) return null;

  const section = sectionsStore[index];
  const updatedSection: Section = {
    ...section,
    ...updates,
    // Regenerate slug if name changed
    slug: updates.name ? generateSlug(updates.name) : section.slug,
  };
  sectionsStore[index] = updatedSection;
  return updatedSection;
}

/**
 * Delete a section
 */
export function deleteSection(id: string): boolean {
  const index = sectionsStore.findIndex((section) => section.id === id);
  if (index === -1) return false;
  sectionsStore.splice(index, 1);
  return true;
}

/**
 * Toggle section enabled status
 */
export function toggleSectionEnabled(id: string): Section | null {
  const section = getSectionById(id);
  if (!section) return null;
  return updateSection(id, { enabled: !section.enabled });
}

// Export for backward compatibility
export const dummySections = sectionsStore;
