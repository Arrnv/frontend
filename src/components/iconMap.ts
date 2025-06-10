import React from "react";
import type { ReactElement } from "react";
import * as LucideIcons from "lucide-react";

// Converts a string icon name into a JSX element
export function getIconByName(name: string, size = 14): ReactElement | null {
  const IconComponent = (LucideIcons as any)[name];
  return IconComponent ? React.createElement(IconComponent, { size }) : null;
}
