import { apiRequest, apiRequestRaw } from "../shared/client";
import type { Category, MenuItem, PaginationMeta, Section, TemporaryPrice } from "../types";

export type ListCategoriesParams = {
  page?: number;
  perPage?: number;
  search?: string;
  enabled?: boolean;
};

export type ListMenuItemsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  sectionId?: string;
  availability?: "available" | "unavailable";
  priceStatus?: "base" | "temporary-active" | "temporary-scheduled";
  includeDisabled?: boolean;
};

function qs(params: Record<string, string | number | boolean | undefined | null>) {
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    out.set(k, String(v));
  }
  const s = out.toString();
  return s ? `?${s}` : "";
}

export function listCategories(params: ListCategoriesParams = {}, signal?: AbortSignal) {
  return apiRequestRaw<{ data: Category[]; meta: PaginationMeta }>(
    `/admin/categories${qs({
      page: params.page,
      perPage: params.perPage,
      search: params.search,
      enabled: params.enabled,
    })}`,
    { method: "GET", auth: true, signal }
  );
}

export function getCategory(id: string, signal?: AbortSignal) {
  return apiRequest<Category>(`/admin/categories/${id}`, { method: "GET", auth: true, signal });
}

export type CreateCategoryInput = {
  name: string;
  description?: string;
  enabled?: boolean;
  image?: File;
};

export function createCategory(input: CreateCategoryInput, signal?: AbortSignal) {
  const fd = new FormData();
  fd.set("name", input.name);
  if (input.description) fd.set("description", input.description);
  if (typeof input.enabled === "boolean") fd.set("enabled", String(input.enabled));
  if (input.image) fd.set("image", input.image);

  return apiRequest<Category>("/admin/categories", { method: "POST", auth: true, body: fd, signal });
}

export function updateCategory(
  id: string,
  body: Partial<Pick<Category, "name" | "description" | "enabled">> & {
    image?: File;
  },
  signal?: AbortSignal
) {
  const fd = new FormData();
  if (body.name !== undefined) fd.set("name", body.name);
  if (body.description !== undefined && body.description !== null) fd.set("description", body.description);
  if (body.enabled !== undefined) fd.set("enabled", String(body.enabled));
  if (body.image) fd.set("image", body.image);

  return apiRequest<Category>(`/admin/categories/${id}`, {
    method: "PATCH",
    auth: true,
    body: fd,
    signal,
  });
}

export function setCategoryEnabled(id: string, enabled: boolean, signal?: AbortSignal) {
  const fd = new FormData();
  fd.set("enabled", String(enabled));

  return apiRequest<Category>(`/admin/categories/${id}`, { method: "PATCH", auth: true, body: fd, signal });
}

export function reorderCategories(categoryIds: string[], signal?: AbortSignal) {
  return apiRequest<{ success: boolean }>("/admin/categories/reorder", {
    method: "POST",
    auth: true,
    body: { categoryIds },
    signal,
  });
}

export function listSections(params?: { categoryId?: string; includeDisabled?: boolean }, signal?: AbortSignal) {
  return apiRequest<Section[]>(
    `/admin/sections${qs({
      categoryId: params?.categoryId,
      includeDisabled: params?.includeDisabled ?? true,
    })}`,
    { method: "GET", auth: true, signal }
  );
}

export function createSection(
  body: Pick<Section, "categoryId" | "name"> &
    Partial<Pick<Section, "slug" | "description" | "imageUrl" | "order" | "enabled">>,
  signal?: AbortSignal
) {
  return apiRequest<Section>("/admin/sections", { method: "POST", auth: true, body, signal });
}

export function updateSection(
  id: string,
  body: Partial<
    Pick<Section, "categoryId" | "name" | "slug" | "description" | "imageUrl" | "order" | "enabled">
  >,
  signal?: AbortSignal
) {
  return apiRequest<Section>(`/admin/sections/${id}`, { method: "PATCH", auth: true, body, signal });
}

export function setSectionEnabled(id: string, enabled: boolean, signal?: AbortSignal) {
  return apiRequest<Pick<Section, "id" | "enabled">>(`/admin/sections/${id}/enabled`, {
    method: "PATCH",
    auth: true,
    body: { enabled },
    signal,
  });
}

export function reorderSections(categoryId: string, sectionIds: string[], signal?: AbortSignal) {
  return apiRequest<{ success: boolean }>("/admin/sections/reorder", {
    method: "POST",
    auth: true,
    body: { categoryId, sectionIds },
    signal,
  });
}

export type ListMenuItemsResponse = {
  items: MenuItem[];
  meta: PaginationMeta;
};

export async function listMenuItems(params: ListMenuItemsParams = {}, signal?: AbortSignal) {
  const { page = 1, pageSize = 10 } = params;
  const data = await apiRequest<{ items: MenuItem[]; meta: PaginationMeta }>(
    `/admin/menu-items${qs({
      page,
      pageSize,
      search: params.search,
      categoryId: params.categoryId,
      sectionId: params.sectionId,
      availability: params.availability,
      priceStatus: params.priceStatus,
      includeDisabled: params.includeDisabled ?? true,
    })}`,
    { method: "GET", auth: true, signal }
  );
  return { items: data.items, meta: data.meta } satisfies ListMenuItemsResponse;
}

export function getMenuItem(id: string, signal?: AbortSignal) {
  return apiRequest<MenuItem>(`/admin/menu-items/${id}`, { method: "GET", auth: true, signal });
}

export function createMenuItem(
  body: Pick<MenuItem, "categoryId" | "sectionId" | "name" | "basePrice"> &
    Partial<Pick<MenuItem, "slug" | "description" | "imageUrl" | "available" | "enabled">>,
  signal?: AbortSignal
) {
  return apiRequest<MenuItem>("/admin/menu-items", { method: "POST", auth: true, body, signal });
}

export function updateMenuItem(
  id: string,
  body: Partial<
    Pick<
      MenuItem,
      | "categoryId"
      | "sectionId"
      | "name"
      | "slug"
      | "description"
      | "basePrice"
      | "imageUrl"
      | "available"
      | "enabled"
    >
  >,
  signal?: AbortSignal
) {
  return apiRequest<MenuItem>(`/admin/menu-items/${id}`, { method: "PATCH", auth: true, body, signal });
}

export function setMenuItemAvailability(id: string, available: boolean, signal?: AbortSignal) {
  return apiRequest<Pick<MenuItem, "id" | "available">>(`/admin/menu-items/${id}/availability`, {
    method: "PATCH",
    auth: true,
    body: { available },
    signal,
  });
}

export function setMenuItemEnabled(id: string, enabled: boolean, signal?: AbortSignal) {
  return apiRequest<Pick<MenuItem, "id" | "enabled">>(`/admin/menu-items/${id}/enabled`, {
    method: "PATCH",
    auth: true,
    body: { enabled },
    signal,
  });
}

export function deleteMenuItem(id: string, signal?: AbortSignal) {
  return apiRequest<{ success: boolean }>(`/admin/menu-items/${id}`, { method: "DELETE", auth: true, signal });
}

export function listTemporaryPrices(menuItemId: string, signal?: AbortSignal) {
  return apiRequest<TemporaryPrice[]>(`/admin/menu-items/${menuItemId}/temporary-prices`, {
    method: "GET",
    auth: true,
    signal,
  });
}

export function createTemporaryPrice(
  menuItemId: string,
  body: Pick<TemporaryPrice, "ruleName" | "price" | "startAt" | "endAt"> &
    Partial<Pick<TemporaryPrice, "enabled">>,
  signal?: AbortSignal
) {
  return apiRequest<TemporaryPrice>(`/admin/menu-items/${menuItemId}/temporary-prices`, {
    method: "POST",
    auth: true,
    body,
    signal,
  });
}

export function updateTemporaryPrice(
  menuItemId: string,
  tempPriceId: string,
  body: Partial<Pick<TemporaryPrice, "ruleName" | "price" | "startAt" | "endAt" | "enabled">>,
  signal?: AbortSignal
) {
  return apiRequest<TemporaryPrice>(`/admin/menu-items/${menuItemId}/temporary-prices/${tempPriceId}`, {
    method: "PATCH",
    auth: true,
    body,
    signal,
  });
}

export function setTemporaryPriceEnabled(
  menuItemId: string,
  tempPriceId: string,
  enabled: boolean,
  signal?: AbortSignal
) {
  return apiRequest<Pick<TemporaryPrice, "id" | "enabled">>(
    `/admin/menu-items/${menuItemId}/temporary-prices/${tempPriceId}/enabled`,
    { method: "PATCH", auth: true, body: { enabled }, signal }
  );
}

export function duplicateTemporaryPrice(menuItemId: string, tempPriceId: string, signal?: AbortSignal) {
  return apiRequest<TemporaryPrice>(`/admin/menu-items/${menuItemId}/temporary-prices/${tempPriceId}/duplicate`, {
    method: "POST",
    auth: true,
    signal,
  });
}

export function deleteTemporaryPrice(menuItemId: string, tempPriceId: string, signal?: AbortSignal) {
  return apiRequest<{ success: boolean }>(`/admin/menu-items/${menuItemId}/temporary-prices/${tempPriceId}`, {
    method: "DELETE",
    auth: true,
    signal,
  });
}

