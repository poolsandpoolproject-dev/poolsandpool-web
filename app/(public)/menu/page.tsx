import Link from "next/link";
import { getEnabledCategories, getSectionsByCategoryId } from "@/lib/data";

export default function MenuPage() {
  // Use dummy data
  const categories = getEnabledCategories();

  // Add sections to each category
  const categoriesWithSections = categories.map((category) => ({
    ...category,
    sections: getSectionsByCategoryId(category.id),
  }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold text-primary mb-2">
          Our Menu
        </h1>
        <p className="text-text-secondary">
          Discover our selection of premium food, drinks, and more
        </p>
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
              <div className="h-32 w-full bg-background-alt overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-text-secondary">
                    No image
                  </div>
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
                    {category.sections.length > 4 && (
                      <li className="text-text-light">• and more...</li>
                    )}
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
