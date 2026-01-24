/**
 * Temporary Prices Data Management
 * Handles temporary pricing rules for menu items
 */

export interface TemporaryPrice {
  id: string;
  menuItemId: string;
  ruleName: string;
  price: number;
  startAt: string; // ISO 8601 datetime string
  endAt: string; // ISO 8601 datetime string
  enabled: boolean; // Whether this price rule is active/enabled
  createdAt: string;
  updatedAt: string;
}

// In-memory store (will be replaced with API)
let temporaryPricesStore: TemporaryPrice[] = [];

/**
 * Get all temporary prices for a menu item
 */
export function getTemporaryPricesByMenuItemId(menuItemId: string): TemporaryPrice[] {
  return temporaryPricesStore
    .filter((tp) => tp.menuItemId === menuItemId)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

/**
 * Get active temporary price for a menu item at a given time
 * Returns the most recent enabled price that's within the date range, or null if none
 */
export function getActiveTemporaryPrice(
  menuItemId: string,
  atTime: Date = new Date()
): TemporaryPrice | null {
  const activePrices = temporaryPricesStore.filter((tp) => {
    if (tp.menuItemId !== menuItemId || !tp.enabled) return false;
    const start = new Date(tp.startAt);
    const end = new Date(tp.endAt);
    return atTime >= start && atTime <= end;
  });

  if (activePrices.length === 0) return null;

  // Return most recent active price
  return activePrices.sort((a, b) => {
    return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
  })[0];
}

/**
 * Get upcoming temporary prices for a menu item
 */
export function getUpcomingTemporaryPrices(
  menuItemId: string,
  atTime: Date = new Date()
): TemporaryPrice[] {
  return temporaryPricesStore
    .filter((tp) => {
      if (tp.menuItemId !== menuItemId) return false;
      const start = new Date(tp.startAt);
      return start > atTime;
    })
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

/**
 * Get expired temporary prices for a menu item
 */
export function getExpiredTemporaryPrices(
  menuItemId: string,
  atTime: Date = new Date()
): TemporaryPrice[] {
  return temporaryPricesStore
    .filter((tp) => {
      if (tp.menuItemId !== menuItemId) return false;
      const end = new Date(tp.endAt);
      return end < atTime;
    })
    .sort((a, b) => new Date(b.endAt).getTime() - new Date(a.endAt).getTime());
}

/**
 * Create a new temporary price
 */
export function createTemporaryPrice(
  menuItemId: string,
  ruleName: string,
  price: number,
  startAt: string,
  endAt: string,
  enabled: boolean = true
): TemporaryPrice {
  const id = `tp${Date.now()}`;
  const now = new Date().toISOString();
  const newPrice: TemporaryPrice = {
    id,
    menuItemId,
    ruleName,
    price,
    startAt,
    endAt,
    enabled,
    createdAt: now,
    updatedAt: now,
  };
  temporaryPricesStore.push(newPrice);
  return newPrice;
}

/**
 * Update a temporary price
 */
export function updateTemporaryPrice(
  id: string,
  updates: Partial<Omit<TemporaryPrice, "id" | "menuItemId" | "createdAt" | "updatedAt">>
): TemporaryPrice | null {
  const index = temporaryPricesStore.findIndex((tp) => tp.id === id);
  if (index === -1) return null;

  const updated: TemporaryPrice = {
    ...temporaryPricesStore[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  temporaryPricesStore[index] = updated;
  return updated;
}

/**
 * Delete a temporary price
 */
export function deleteTemporaryPrice(id: string): boolean {
  const index = temporaryPricesStore.findIndex((tp) => tp.id === id);
  if (index === -1) return false;
  temporaryPricesStore.splice(index, 1);
  return true;
}

/**
 * Duplicate a temporary price (for reuse)
 * Duplicated prices are disabled by default so user can update dates before enabling
 */
export function duplicateTemporaryPrice(id: string): TemporaryPrice | null {
  const original = temporaryPricesStore.find((tp) => tp.id === id);
  if (!original) return null;

  return createTemporaryPrice(
    original.menuItemId,
    `${original.ruleName} (Copy)`,
    original.price,
    original.startAt,
    original.endAt,
    false // Disabled by default - user must enable after updating dates
  );
}

/**
 * Toggle temporary price enabled/disabled status
 */
export function toggleTemporaryPriceEnabled(id: string): TemporaryPrice | null {
  const price = getTemporaryPriceById(id);
  if (!price) return null;
  return updateTemporaryPrice(id, { enabled: !price.enabled });
}

/**
 * Get temporary price by ID
 */
export function getTemporaryPriceById(id: string): TemporaryPrice | undefined {
  return temporaryPricesStore.find((tp) => tp.id === id);
}
