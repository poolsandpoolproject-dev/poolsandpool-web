import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/api/public/menu";
import { ApiError } from "@/lib/api/shared/client";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://poolsandpool.co";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ categorySlug: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { categorySlug } = await params;
  let category;
  try {
    category = await getCategoryBySlug(categorySlug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return { title: "Category Not Found" };
    throw e;
  }

  const title = `${category.name} Menu`;
  const description =
    category.description ??
    `Browse our ${category.name.toLowerCase()} menu at Pools & Pool.`;
  const url = `${baseUrl}/menu/${categorySlug}`;
  const ogImage = category.imageUrl
    ? { url: category.imageUrl, width: 1200, height: 630, alt: category.name }
    : { url: `${baseUrl}/graph.png`, width: 1200, height: 630, alt: category.name };

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Pools & Pool`,
      description,
      url,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Pools & Pool`,
      description,
      images: [ogImage.url],
    },
  };
}

export default function CategorySlugLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
