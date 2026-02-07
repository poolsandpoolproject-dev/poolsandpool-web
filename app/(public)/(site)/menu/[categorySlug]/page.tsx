import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, getSectionsByCategoryId, getMenuItemsByCategoryId } from "@/lib/data";

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} Menu - Pools & Pool`,
    description: `Browse our ${category.name.toLowerCase()} menu at Pools & Pool`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;

  const category = getCategoryBySlug(categorySlug);
  if (!category || !category.enabled) notFound();

  const sections = getSectionsByCategoryId(category.id);
  const menuItems = getMenuItemsByCategoryId(category.id);

  const itemsBySection = sections.reduce((acc, section) => {
    acc[section.id] = menuItems.filter((item) => item.sectionId === section.id);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const uncategorizedItems = menuItems.filter((item) => !sections.some((s) => s.id === item.sectionId));

  const MenuItemCard = ({ item }: { item: (typeof menuItems)[number] }) => {
    return (
      <div className="p-4 bg-white border border-border rounded-lg hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          <div className="h-16 w-16 rounded-lg border border-border bg-background-alt overflow-hidden shrink-0 relative">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" unoptimized />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-text-secondary">No image</div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2 gap-3">
              <h3 className="font-semibold text-text-primary">{item.name}</h3>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">₦{item.currentPrice.toLocaleString()}</p>
                {item.temporaryPrice && (
                  <span className="text-xs bg-secondary text-white px-2 py-1 rounded">{item.temporaryPrice.ruleName}</span>
                )}
              </div>
            </div>
            {item.description && <p className="text-sm text-text-secondary italic">{item.description}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <Link href="/menu" className="text-sm text-primary hover:text-secondary mb-4 inline-block">
          ← Back to Menu
        </Link>
        <h1 className="font-serif text-4xl font-bold text-primary mb-2">{category.name}</h1>
        <p className="text-text-secondary">
          {category.description ? category.description : `Browse our ${category.name.toLowerCase()} selection`}
        </p>
      </div>

      {sections.length === 0 && menuItems.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p>No menu items available in this category yet.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sections.map((section) => {
            const items = itemsBySection[section.id] || [];
            if (items.length === 0) return null;

            return (
              <div key={section.id} className="space-y-4">
                <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2">{section.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })}

          {uncategorizedItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2">Other Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uncategorizedItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

