"use client";
import React from "react";
import { NavLinkItem } from "./navLinks";
import { JSX } from "react/jsx-runtime";


export const renderMenu = (items: NavLinkItem[], isSub: boolean = false): JSX.Element => {
  return (
    <div
      className={`${
        isSub
          ? "absolute top-0 left-full hidden group-hover/sub:flex"
          : "absolute top-full left-0 hidden group-hover:flex"
      } flex-col bg-white shadow-lg rounded-md py-2 w-[20rem] z-50`}
    >
      {items.map((item, idx) => {
        const itemClasses = ` py-2 hover:bg-gray-100 ${item.className || ""}`;

        if (item.subLinks) {
          return (
            <div key={idx} className="relative group/sub items-center">
                <a href="#" className={itemClasses}>
                    <div className="flex items-center p-2 gap-2">
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                    </div>
                </a>
                {renderMenu(item.subLinks, true)}
            </div>

          );
        } else {
          return (
            <a key={idx} href={item.href} className={itemClasses}>
                <div className="flex items-center gap-2 px-2">
                    {item.icon && <span className="flex items-center justify-center">{item.icon}</span>}
                    <span>{item.label}</span>
                </div>
            </a>
          );
        }
      })}
    </div>
  );
};
