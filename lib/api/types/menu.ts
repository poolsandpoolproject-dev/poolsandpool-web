export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  order?: number | null;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  sections?: Section[];
  sectionsCount?: number;
  sectionNames?: string[];
};

export type Section = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  order?: number | null;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TemporaryPriceStatus = "ACTIVE" | "UPCOMING" | "EXPIRED";

export type TemporaryPrice = {
  id: string;
  ruleName: string;
  price: number;
  startAt: string;
  endAt: string;
  enabled: boolean;
  status?: TemporaryPriceStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  sectionId: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: number;
  imageUrl?: string | null;
  available: boolean;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  currentPrice?: number;
  hasActiveTemporaryPrice?: boolean;
  activeTemporaryPrice?: TemporaryPrice | null;
};

export type PaginationMeta = {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
};

