'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type SubCategory = { key: string; label: string };

type FloatingSubmenuProps = {
  anchorRect: DOMRect | null;
  subcategories: SubCategory[];
  selectedSubcategory: string | null;
  onSelect: (subcategoryId: string) => void;
};

const FloatingSubmenu: React.FC<FloatingSubmenuProps> = ({
  anchorRect,
  subcategories,
  selectedSubcategory,
  onSelect,
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

  return createPortal(
    <div style={style}>
      {subcategories.length === 0 ? (
        <div className="text-sm text-black">No options</div>
      ) : (
        subcategories.map(sub => (
          <button
            key={sub.key}
            className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-blue-100 text-black ${
              selectedSubcategory === sub.key ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
            onClick={() => onSelect(sub.key)}
          >
            <p className='text-black'>{sub.label}</p>
          </button>
        ))
      )}
    </div>,
    document.body
  );
};

export default FloatingSubmenu;
