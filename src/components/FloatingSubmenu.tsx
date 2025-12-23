'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type SubCategory = { key: string; label: string };

type FloatingSubmenuProps = {
  anchorRect: DOMRect | null;
  subcategories: SubCategory[];
  selectedSubcategory: string[];
  allowMultiSelect: boolean;
  onSelect: (subcategoryIds: string[]) => void;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
};

const FloatingSubmenu: React.FC<FloatingSubmenuProps> = ({
  anchorRect,
  subcategories,
  selectedSubcategory,
  allowMultiSelect,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !anchorRect) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    top: anchorRect.top + window.scrollY,
    left: anchorRect.right + 12,
    zIndex: 9999,
  };

  const handleClick = (key: string) => {
    if (allowMultiSelect) {
      const isSelected = selectedSubcategory.includes(key);
      onSelect(
        isSelected
          ? selectedSubcategory.filter(k => k !== key)
          : [...selectedSubcategory, key]
      );
    } else {
      onSelect([key]);
    }
  };

  return createPortal(
    <div
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="
        bg-white
        rounded-xl
        shadow-2xl
        ring-1 ring-black/10
        p-2
        w-[240px]
max-w-[240px]
      "
    >
      {subcategories.length === 0 ? (
        <div className="px-3 py-2 text-sm text-slate-500">
          No options
        </div>
      ) : (
        subcategories.map(sub => {
          const isSelected = selectedSubcategory.includes(sub.key);

          return (
            <button
              key={sub.key}
              onClick={() => handleClick(sub.key)}
              className={`
                w-full text-left
                px-4 py-2
                rounded-lg
                text-sm
                transition
                ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-100'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span>{sub.label}</span>

                {allowMultiSelect && isSelected && (
                  <span className="text-xs text-blue-600">✓</span>
                )}
              </div>
            </button>
          );
        })
      )}
    </div>,
    document.body
  );
};

export default FloatingSubmenu;
