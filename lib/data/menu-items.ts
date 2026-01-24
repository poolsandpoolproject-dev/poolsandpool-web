/**
 * Dummy Menu Items Data
 * Will be replaced with API calls when backend is ready
 */

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  sectionId: string;
  basePrice: number;
  currentPrice: number;
  available: boolean;
  imageUrl?: string;
  /**
   * @deprecated Use `imageUrl` instead.
   */
  image?: string;
  // Note: temporaryPrice is kept for backward compatibility
  // Use temporary-prices.ts functions for managing multiple temporary prices
  temporaryPrice?: {
    price: number;
    ruleName: string;
    startAt: string;
    endAt: string;
  };
}

// In-memory store (will be replaced with API)
let menuItemsStore: MenuItem[] = [
  // Food - Small Chops
  { id: "i1", name: "Chicken Wings", description: "Spicy chicken wings with special sauce", categoryId: "1", sectionId: "s1", basePrice: 3500, currentPrice: 3500, available: true, imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=800&q=80" },
  { id: "i2", name: "Spring Rolls", description: "Crispy spring rolls with dipping sauce", categoryId: "1", sectionId: "s1", basePrice: 3000, currentPrice: 3000, available: true },
  
  // Food - Grills & BBQ
  { id: "i3", name: "Grilled Chicken", description: "Tender grilled chicken with herbs", categoryId: "1", sectionId: "s2", basePrice: 5000, currentPrice: 5000, available: true },
  { id: "i4", name: "BBQ Ribs", description: "Slow-cooked BBQ ribs", categoryId: "1", sectionId: "s2", basePrice: 6500, currentPrice: 6500, available: true },
  
  // Food - Main Dishes
  { id: "i5", name: "Jollof Rice", description: "Nigerian jollof rice with chicken", categoryId: "1", sectionId: "s3", basePrice: 4000, currentPrice: 4000, available: true },
  { id: "i6", name: "Fried Rice", description: "Special fried rice with mixed vegetables", categoryId: "1", sectionId: "s3", basePrice: 4500, currentPrice: 4500, available: true },
  
  // Food - Sides
  { id: "i7", name: "French Fries", description: "Crispy golden fries", categoryId: "1", sectionId: "s4", basePrice: 2000, currentPrice: 2000, available: true, imageUrl: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80" },
  
  // Food - Platters
  { id: "i8", name: "Mixed Platter", description: "Assorted appetizers platter", categoryId: "1", sectionId: "s5", basePrice: 8000, currentPrice: 8000, available: true },
  
  // Drinks - Signature Cocktails
  { id: "i9", name: "Signature Mojito", description: "House special mojito with fresh mint", categoryId: "2", sectionId: "s6", basePrice: 4500, currentPrice: 4500, available: true, imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80" },
  { id: "i10", name: "Pool's Special", description: "Our signature cocktail blend", categoryId: "2", sectionId: "s6", basePrice: 5000, currentPrice: 5000, available: true },
  
  // Drinks - Classic Cocktails
  { id: "i11", name: "Margarita", description: "Classic margarita", categoryId: "2", sectionId: "s7", basePrice: 4000, currentPrice: 4000, available: true },
  { id: "i12", name: "Old Fashioned", description: "Classic whiskey cocktail", categoryId: "2", sectionId: "s7", basePrice: 4500, currentPrice: 4500, available: true },
  
  // Drinks - Beers & Ciders
  { id: "i13", name: "Heineken", description: "Premium beer", categoryId: "2", sectionId: "s8", basePrice: 3000, currentPrice: 3000, available: true },
  { id: "i14", name: "Stella Artois", description: "Premium lager", categoryId: "2", sectionId: "s8", basePrice: 3200, currentPrice: 3200, available: true },
  
  // Drinks - Wines
  { id: "i15", name: "House Wine (Glass)", description: "Red or white wine", categoryId: "2", sectionId: "s9", basePrice: 3500, currentPrice: 3500, available: true },
  
  // Drinks - Spirits
  { id: "i16", name: "Hennessy VS", description: "Premium cognac", categoryId: "2", sectionId: "s10", basePrice: 12000, currentPrice: 12000, available: true },
  
  // Drinks - Non-Alcoholic
  { id: "i17", name: "Fresh Orange Juice", description: "Freshly squeezed orange juice", categoryId: "2", sectionId: "s11", basePrice: 2000, currentPrice: 2000, available: true },
  
  // Smoke - Shisha
  { id: "i18", name: "Premium Shisha", description: "Flavored shisha with choice of flavor", categoryId: "3", sectionId: "s12", basePrice: 6000, currentPrice: 6000, available: true, imageUrl: "https://images.unsplash.com/photo-1611316265282-7d4b6a3b15a5?auto=format&fit=crop&w=800&q=80" },
  { id: "i19", name: "Deluxe Shisha", description: "Premium shisha with special flavors", categoryId: "3", sectionId: "s12", basePrice: 8000, currentPrice: 8000, available: true },
  
  // Smoke - Cigars
  { id: "i20", name: "Cuban Cigar", description: "Premium Cuban cigar", categoryId: "3", sectionId: "s13", basePrice: 8000, currentPrice: 8000, available: true },
  
  // Smoke - Cigarettes
  { id: "i21", name: "Marlboro", description: "Premium cigarettes", categoryId: "3", sectionId: "s14", basePrice: 1500, currentPrice: 1500, available: true },
];

/**
 * Get all menu items
 */
export function getAllMenuItems(): MenuItem[] {
  return [...menuItemsStore];
}

/**
 * Get menu item by ID
 */
export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItemsStore.find((item) => item.id === id);
}

/**
 * Get menu items by category ID
 */
export function getMenuItemsByCategoryId(categoryId: string): MenuItem[] {
  return menuItemsStore.filter((item) => item.categoryId === categoryId);
}

/**
 * Get menu items by section ID
 */
export function getMenuItemsBySectionId(sectionId: string): MenuItem[] {
  return menuItemsStore.filter((item) => item.sectionId === sectionId);
}

/**
 * Get all available menu items
 */
export function getAvailableMenuItems(): MenuItem[] {
  return menuItemsStore.filter((item) => item.available);
}

/**
 * Create a new menu item
 */
export function createMenuItem(
  name: string,
  categoryId: string,
  sectionId: string,
  basePrice: number,
  description?: string,
  imageUrl?: string,
  available: boolean = true
): MenuItem {
  const id = `i${Date.now()}`;
  const newItem: MenuItem = {
    id,
    name,
    description,
    categoryId,
    sectionId,
    basePrice,
    currentPrice: basePrice,
    available,
    imageUrl,
  };
  menuItemsStore.push(newItem);
  return newItem;
}

/**
 * Update a menu item
 */
export function updateMenuItem(
  id: string,
  updates: Partial<Omit<MenuItem, "id" | "currentPrice">>
): MenuItem | null {
  const index = menuItemsStore.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const item = menuItemsStore[index];
  const updatedItem: MenuItem = {
    ...item,
    ...updates,
    // Update currentPrice if basePrice changed
    currentPrice: updates.basePrice !== undefined ? updates.basePrice : item.currentPrice,
  };
  menuItemsStore[index] = updatedItem;
  return updatedItem;
}

/**
 * Delete a menu item
 */
export function deleteMenuItem(id: string): boolean {
  const index = menuItemsStore.findIndex((item) => item.id === id);
  if (index === -1) return false;
  menuItemsStore.splice(index, 1);
  return true;
}

/**
 * Toggle menu item availability
 */
export function toggleMenuItemAvailability(id: string): MenuItem | null {
  const item = getMenuItemById(id);
  if (!item) return null;
  return updateMenuItem(id, { available: !item.available });
}

/**
 * Get menu items by category slug
 */
export function getMenuItemsByCategorySlug(categorySlug: string, categories: { id: string; slug: string }[]): MenuItem[] {
  const category = categories.find((cat) => cat.slug === categorySlug);
  if (!category) return [];
  return getMenuItemsByCategoryId(category.id);
}

/**
 * Get menu items by category ID (backward compatibility)
 */
export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return getMenuItemsByCategoryId(categoryId);
}

/**
 * Get menu items by section ID (backward compatibility)
 */
export function getMenuItemsBySection(sectionId: string): MenuItem[] {
  return getMenuItemsBySectionId(sectionId);
}

// Export for backward compatibility
export const dummyMenuItems = menuItemsStore;
