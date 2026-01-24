/**
 * Dummy Categories Data
 * Will be replaced with API calls when backend is ready
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  enabled: boolean;
}

// In-memory store (will be replaced with API)
let categoriesStore: Category[] = [
  {
    id: "1",
    name: "Food",
    slug: "food",
    description: "Small chops, grills, mains and sides",
    imageUrl: "https://img.freepik.com/free-photo/top-view-fast-food-mix-mozzarella-sticks-club-sandwich-hamburger-mushroom-pizza-caesar-shrimp-salad-french-fries-ketchup-mayo-cheese-sauces-table_141793-3998.jpg?semt=ais_hybrid&w=740&q=80",
    enabled: true,
  },
  {
    id: "2",
    name: "Drinks",
    slug: "drinks",
    description: "Cocktails, wines, beers and more",
    imageUrl: "https://www.bhg.com/thmb/lRY29ITOQFKy4qzeQfL4mld0WPc=/1244x0/filters:no_upscale():strip_icc()/bar-cart-alcohol-drinks-17483300-4120bc9cec73441eb2c7fee3922baf3b.jpg",
    enabled: true,
  },
  {
    id: "3",
    name: "Smoke",
    slug: "smoke",
    description: "Shisha, cigars and cigarettes",
    imageUrl: "https://thumbs.dreamstime.com/b/shisha-hookah-smoke-colored-neon-light-dark-background-shisha-hookah-smoke-colored-neon-light-dark-310781585.jpg",
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
 * Get all categories
 */
export function getAllCategories(): Category[] {
  return [...categoriesStore];
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return categoriesStore.find((cat) => cat.id === id);
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categoriesStore.find((cat) => cat.slug === slug && cat.enabled);
}

/**
 * Get all enabled categories
 */
export function getEnabledCategories(): Category[] {
  return categoriesStore.filter((cat) => cat.enabled);
}

/**
 * Create a new category
 */
export function createCategory(
  name: string,
  enabled: boolean = true,
  description?: string,
  imageUrl?: string
): Category {
  const slug = generateSlug(name);
  const id = Date.now().toString();
  const newCategory: Category = {
    id,
    name,
    slug,
    description,
    imageUrl,
    enabled,
  };
  categoriesStore.push(newCategory);
  return newCategory;
}

/**
 * Update a category
 */
export function updateCategory(
  id: string,
  updates: Partial<Omit<Category, "id" | "slug">>
): Category | null {
  const index = categoriesStore.findIndex((cat) => cat.id === id);
  if (index === -1) return null;

  const category = categoriesStore[index];
  const updatedCategory: Category = {
    ...category,
    ...updates,
    // Regenerate slug if name changed
    slug: updates.name ? generateSlug(updates.name) : category.slug,
  };
  categoriesStore[index] = updatedCategory;
  return updatedCategory;
}

/**
 * Delete a category
 */
export function deleteCategory(id: string): boolean {
  const index = categoriesStore.findIndex((cat) => cat.id === id);
  if (index === -1) return false;
  categoriesStore.splice(index, 1);
  return true;
}

/**
 * Toggle category enabled status
 */
export function toggleCategoryEnabled(id: string): Category | null {
  const category = getCategoryById(id);
  if (!category) return null;
  return updateCategory(id, { enabled: !category.enabled });
}

// Export for backward compatibility
export const dummyCategories = categoriesStore;
