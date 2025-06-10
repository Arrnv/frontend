// src/components/navLinks.types.ts
import type { ReactNode } from "react";

export interface NavLinkItem {
  key: string;        // ✅ required
  id?: string;        // optional if only nested items have it
  label: string;
  href?: string;
  className?: string;
  subLinks?: NavLinkItem[];
  icon?: ReactNode;
}


