import Image from "next/image";
import Link from "next/link";
import { getEnabledCategories, getSectionsByCategoryId } from "@/lib/data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://poolsandpool.co";

export const metadata = {
  title: "Our Menu",
  description:
    "Discover our selection of premium food, drinks, and more at Pools & Pool. Browse categories and explore our full menu.",
  alternates: { canonical: `${baseUrl}/menu` },
  openGraph: {
    title: "Our Menu | Pools & Pool",
    description:
      "Discover our selection of premium food, drinks, and more at Pools & Pool.",
    url: `${baseUrl}/menu`,
    type: "website" as const,
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Our Menu | Pools & Pool",
    description:
      "Discover our selection of premium food, drinks, and more at Pools & Pool.",
  },
};

export default function MenuPage() {
  const categories = getEnabledCategories();

  const categoriesWithSections = categories.map((category) => ({
    ...category,
    sections: getSectionsByCategoryId(category.id),
  }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold text-primary mb-2">Our Menu</h1>
        <p className="text-text-secondary">Discover our selection of premium food, drinks, and more</p>
      </div>

      {categoriesWithSections.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p>No menu categories available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithSections.map((category) => (
            <Link
              key={category.id}
              href={`/menu/${category.slug}`}
              className="group bg-white border-2 border-border rounded-xl overflow-hidden hover:border-primary transition-colors"
            >
              <div className="h-32 w-full bg-background-alt overflow-hidden relative">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-text-secondary">No image</div>
                )}
              </div>
              <div className="p-6 space-y-3">
                <h2 className="text-2xl font-semibold text-primary group-hover:text-secondary transition-colors">
                  {category.name}
                </h2>
                {category.sections.length > 0 && (
                  <ul className="space-y-1.5 text-text-secondary text-sm">
                    {category.sections.slice(0, 4).map((section) => (
                      <li key={section.id}>• {section.name}</li>
                    ))}
                    {category.sections.length > 4 && <li className="text-text-light">• and more...</li>}
                  </ul>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

