'use client';

import React, { useState, useRef, useEffect } from 'react';

type Plan = {
  id: string;
  name: string;
  price: number;
  duration: string;
};

type Props = {
  plans: Plan[];
  value: string;
  onChange: (id: string) => void;
};

export default function PlanSelect({ plans, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedPlan = plans.find((p) => p.id === value);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-full px-4 py-3 rounded-xl text-left
          bg-white
          ring-1 ring-black/10
          hover:ring-black/20
          focus:ring-2 focus:ring-[#0099E8]
          transition
        "
      >
        <div className="text-sm text-[#202231] mt-0.5">
          {selectedPlan
            ? `${selectedPlan.name} — ₹${selectedPlan.price} / ${selectedPlan.duration}`
            : 'Select a plan'}
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 w-full
            bg-white
            rounded-xl
            shadow-xl
            ring-1 ring-black/10
            overflow-hidden
          "
        >
          {plans.map((plan) => {
            const isSelected = plan.id === value;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  onChange(plan.id);
                  setOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-3
                  transition
                  ${
                    isSelected
                      ? 'bg-[#0099E8]/10'
                      : 'hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        isSelected
                          ? 'text-[#0099E8]'
                          : 'text-[#202231]'
                      }`}
                    >
                      {plan.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {plan.duration}
                    </div>
                  </div>

                  <div
                    className={`text-sm font-semibold ${
                      isSelected
                        ? 'text-[#0099E8]'
                        : 'text-slate-700'
                    }`}
                  >
                    ₹{plan.price}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
