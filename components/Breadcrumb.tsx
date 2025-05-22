import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className="text-sm text-stone-600 dark:text-stone-400">
      <ol className="flex items-center space-x-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-stone-700 dark:text-stone-300">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <ChevronRight size={16} className="mx-1.5 text-stone-400 dark:text-stone-500" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 