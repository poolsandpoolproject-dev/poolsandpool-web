import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/api/public/menu";
import type { PublicMenuItemFromApi } from "@/lib/api/public/menu";
import { ApiError } from "@/lib/api/shared/client";
import { CategoryHero } from "@/components/public/category-hero";
import { SectionLinks } from "@/components/public/section-links";
import { Container } from "@/components/ui/container";

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;

  let category;
  try {
    category = await getCategoryBySlug(categorySlug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const sections = category.sections;
  const hasAnyItems = sections.some((s) => (s.menuItems?.length ?? 0) > 0);

  const MenuItemRow = ({ item }: { item: PublicMenuItemFromApi }) => {
    return (
      <div className="border-b border-white/10 pb-5 flex flex-col md:flex-row md:gap-4 gap-3">
        <div className="relative w-full md:w-20 h-40 md:h-20 rounded-lg overflow-hidden bg-white/10 shrink-0">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80px"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs uppercase">No image</div>
          )}
        </div>
        <div className="min-w-0 flex-1 flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-white font-bold tracking-wide uppercase text-base md:text-base min-w-0">
              {item.name}
            </h3>
            <span className="shrink-0 text-white text-base font-semibold">
              {Number(item.effectivePrice).toLocaleString()} ₦
            </span>
          </div>
          {item.description ? (
            <p className="text-white/80 text-sm italic line-clamp-3 md:line-clamp-none">
              {item.description}
            </p>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <CategoryHero title={`${category.name} Menu`} imageUrl={category.imageUrl} />

      <SectionLinks title={`${category.name} Menu`} sections={sections.map((s) => ({ id: s.id, name: s.name }))} />

      {sections.length === 0 || !hasAnyItems ? (
        <div className="relative overflow-hidden py-12 xl:py-16">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/pattern.png")' }} />
          <div className="absolute inset-0 bg-black/55" />
          <Container className="relative z-10">
            <div className="text-center py-16 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-sm">
              <p className="text-white/90 text-lg">No sections or menu items in this category yet.</p>
              <p className="text-white/70 text-sm mt-2">Check back later for updates.</p>
            </div>
          </Container>
        </div>
      ) : (
        <div className="">
          {sections.map((section) => {
            const items = section.menuItems ?? [];
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

        </div>
      )}
    </div>
  );
}

