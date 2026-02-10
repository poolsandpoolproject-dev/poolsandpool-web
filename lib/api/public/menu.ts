import { apiRequest } from "../shared/client";

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  order?: number;
};

export type PublicMenuItemFromApi = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: string;
  effectivePrice: string;
  imageUrl?: string | null;
  available: boolean;
};

export type PublicSectionWithMenuItems = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  order?: number;
  menuItems: PublicMenuItemFromApi[];
};

export type PublicCategoryWithSections = PublicCategory & {
  sections: PublicSectionWithMenuItems[];
};

export type PublicMenuItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  basePrice: number;
  currentPrice: number;
  hasActiveTemporaryPrice: boolean;
  temporaryPrice?: {
    ruleName: string;
    price: number;
    startAt: string;
    endAt: string;
  } | null;
};

export type PublicSectionWithItems = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  order?: number | null;
  items: PublicMenuItem[];
};

export function listCategories(signal?: AbortSignal) {
  return apiRequest<PublicCategory[]>("/public/categories", { method: "GET", signal });
}

export function getCategoryBySlug(slug: string, signal?: AbortSignal) {
  return apiRequest<PublicCategoryWithSections>(`/public/categories/${encodeURIComponent(slug)}`, { method: "GET", signal });
}

export type PublicMenuOverviewItem = {
  category: PublicCategory;
  sections: Array<Pick<PublicSectionWithMenuItems, "id" | "name" | "slug" | "imageUrl" | "order">>;
};

export async function getMenuOverview(signal?: AbortSignal): Promise<PublicMenuOverviewItem[]> {
  const list = await listCategories(signal);
  const details = await Promise.all(list.map((c) => getCategoryBySlug(c.slug, signal)));
  return details.map((d) => ({
    category: {
      id: d.id,
      name: d.name,
      slug: d.slug,
      description: d.description,
      imageUrl: d.imageUrl,
      order: d.order,
    },
    sections: d.sections.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      imageUrl: s.imageUrl,
      order: s.order,
    })),
  }));
}


