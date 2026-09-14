import Image from "next/image";
import type { ReactNode } from "react";

import { site } from "@/lib/site";

export function Portrait({ alt, className = "" }: { alt: string; className?: string }): ReactNode {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-3xl ${className}`}>
      {site.photo ? (
        <Image src={site.photo} alt={alt} fill sizes="240px" className="object-cover" />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full items-center justify-center bg-[conic-gradient(from_210deg_at_50%_50%,#5227ff,#7cff67,#9fffea,#5227ff)]"
        >
          <span className="text-4xl font-medium tracking-tight text-white mix-blend-overlay sm:text-5xl">TR</span>
        </div>
      )}
    </div>
  );
}
