import { cn } from '@/lib/cn';

/** Shimmering placeholder (shimmer = moving gradient, defined in globals.css). */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-xl', className)} aria-hidden="true" />;
}
