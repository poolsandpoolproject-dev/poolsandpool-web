import { notFound } from "next/navigation";
import { getCategoryBySlug, getSectionsByCategoryId, getMenuItemsByCategoryId } from "@/lib/data";
import { CategoryHero } from "@/components/public/category-hero";
import { SectionLinks } from "@/components/public/section-links";
import { Container } from "@/components/ui/container";

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

  const MenuItemRow = ({ item }: { item: (typeof menuItems)[number] }) => {
    return (
      <div className="border-b border-white/10 pb-5 ">
        <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2">
          {item.description ? (
            <div className="col-span-2 text-sm text-white italic">{item.description}</div>
          ) : null}
          <div className="min-w-0 text-white font-bold tracking-wide uppercase text-base">{item.name}</div>
          <div className="shrink-0 text-right text-white text-base">
            {item.currentPrice.toLocaleString()} <span className="text-white">₦</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <CategoryHero title={`${category.name} Menu`} imageUrl={category.imageUrl} />

      <SectionLinks title={`${category.name} Menu`} sections={sections.map((s) => ({ id: s.id, name: s.name }))} />

      {sections.length === 0 && menuItems.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <p>No menu items available in this category yet.</p>
        </div>
      ) : (
        <div className="">
          {sections.map((section) => {
            const items = itemsBySection[section.id] || [];
            if (items.length === 0) return null;

            return (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className="relative overflow-hidden scroll-mt-24 py-12 xl:py-16"
              >
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/pattern.png")' }} />
                <div className="absolute inset-0 bg-black/55" />

                <Container className="relative z-10">
                  <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur-sm">
                    <div className="relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url("${
                            section.imageUrl && section.imageUrl.trim().length > 0 ? section.imageUrl : "/items.png"
                          }")`,
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="relative z-10 px-6 py-10 sm:px-10">
                        <h2 className="text-4xl sm:text-5xl font-semibold text-white font-serif tracking-wide">
                          {section.name}
                        </h2>
                      </div>
                    </div>

                    <div className="px-6 py-6 sm:px-10 sm:py-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {items.map((item) => (
                          <MenuItemRow key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  </div>
                </Container>
              </div>
            );
          })}

          {uncategorizedItems.length > 0 && (
            <div className="relative overflow-hidden py-12 xl:py-16">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/pattern.png")' }} />
              <div className="absolute inset-0 bg-black/55" />

              <Container className="relative z-10">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur-sm">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/items.png")' }} />
                    <div className="absolute inset-0 bg-black/55" />
                    <div className="relative z-10 px-6 py-10 sm:px-10">
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white font-serif tracking-wide">
                        Other Items
                      </h2>
                    </div>
                  </div>

                  <div className="px-6 py-6 sm:px-10 sm:py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      {uncategorizedItems.map((item) => (
                        <MenuItemRow key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
              </Container>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

