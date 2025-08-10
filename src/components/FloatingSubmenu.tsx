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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !anchorRect) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    top: anchorRect.top + window.scrollY,
    left: anchorRect.right + 12,
    background: 'white',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    border: '1px solid #ddd',
    borderRadius: '0.75rem',
    padding: '1rem',
    zIndex: 9999,
    minWidth: 220,
  };

  const handleClick = (key: string) => {
    if (allowMultiSelect) {
      const isSelected = selectedSubcategory.includes(key);
      const updated = isSelected
        ? selectedSubcategory.filter(k => k !== key)
        : [...selectedSubcategory, key];
      onSelect(updated);
    } else {
      onSelect([key]); // always single-select
    }
  };

return createPortal(
    <div
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {subcategories.length === 0 ? (
        <div className="text-sm text-black hover:text-[#0099E8]">No options</div>
      ) : (
        subcategories.map(sub => {
          const isSelected = selectedSubcategory.includes(sub.key);
          return (
            <button
              key={sub.key}
              className={`flex items-center gap-2 w-full text-left px-2 py-1 text-sm rounded hover:text-[#0099E8] ${
                isSelected ? 'text-blue-600 font-semibold' : 'text-gray-700'
              }`}
              onClick={() => handleClick(sub.key)}
            >
              {allowMultiSelect && <input type="checkbox" checked={isSelected} readOnly />}
              <span className="text-black hover:text-[#0099E8]">{sub.label}</span>
            </button>
          );
        })
      )}
    </div>,
    document.body
  );
};


export default FloatingSubmenu;