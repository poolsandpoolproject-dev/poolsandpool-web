import Link from "next/link";
import { getEnabledCategories } from "@/lib/data";

export default function HomePage() {
  // Use dummy categories for now
  const categories = getEnabledCategories().slice(0, 3);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-center space-y-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary">
          Welcome to Pools & Pool
        </h1>
        <p className="text-lg text-text-secondary max-w-md">
          Luxurious Lounge & Bar
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu/${category.slug}`}
              className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
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
              <div className="p-5 space-y-1">
                <h2 className="text-xl font-semibold text-primary group-hover:text-secondary transition-colors">
                  {category.name}
                </h2>
                <p className="text-text-secondary text-sm line-clamp-2">
                  {category.description ||
                    `View our ${category.name.toLowerCase()} menu`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-3xl mt-8 text-center text-text-secondary">
          <p>Menu categories will appear here once configured.</p>
        </div>
      )}

      <Link
        href="/menu"
        className="mt-4 px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors"
      >
        View Full Menu
      </Link>
    </div>
  );
}
