"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItemType {
  label: string;
  href?: string; // If href is present, it's a link; otherwise, it's the current page
}

interface UnifiedBreadcrumbProps {
  items: BreadcrumbItemType[];
}

export function UnifiedBreadcrumb({ items }: UnifiedBreadcrumbProps) {
  return (
    <div className="bg-gradient-to-r from-primary to-amber-600 w-full p-3 px-[2em] shadow-lg">
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <div key={index} className="contents">
                <BreadcrumbItem className="text-white">
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="text-white font-semibold border-b-2 border-white/40">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={item.href}
                      className="hover:text-white/80 transition-colors"
                    >
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {!isLast && <BreadcrumbSeparator className="text-white/60" />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
