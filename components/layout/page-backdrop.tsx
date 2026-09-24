import type { ReactNode } from "react";

import { CellGrid } from "./cell-grid";

export function PageBackdrop(): ReactNode {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-225 overflow-hidden"
    >
      <CellGrid />
    </div>
  );
}
