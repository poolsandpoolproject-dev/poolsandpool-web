import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-12 space-y-4">
      <h1 className="text-4xl font-bold text-text-primary">Category Not Found</h1>
      <p className="text-text-secondary">
        The menu category you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/menu"
        className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
      >
        View All Categories
      </Link>
    </div>
  );
}
