import { cn } from "@/lib/utils";

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-5", className)}
      aria-hidden="true"
    >
      <path d="M16.6 3c.5 2.8 2.4 4.8 5.1 5.2v3.1c-1.7 0-3.3-.6-4.7-1.6v6.3c0 3.8-3.1 6.9-6.9 6.9-3.8 0-6.9-3.1-6.9-6.9 0-3.8 3.1-6.9 6.9-6.9.3 0 .6 0 .9.1v3.4c-.3-.1-.6-.2-.9-.2-2 0-3.6 1.6-3.6 3.6S8 19.6 10 19.6s3.6-1.6 3.6-3.6V3h3z" />
    </svg>
  );
}

