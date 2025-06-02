export interface NavLinkItem {
    label: string;
    href?: string;
    className?: string;
    subLinks?: NavLinkItem[];
    icon?: React.ReactNode;  
  }
  
  
import {
    MapPin,
    Wrench,
    Camera,
    Store,
    LogIn,
    UserPlus,
    Truck,
    Car,
    Soup,
  } from "lucide-react";
  
export const navLinks: NavLinkItem[] = [
    {
      label: "Places",
      icon: <MapPin size={16} />,
      subLinks: [
        { label: "Restaurant", href: "#", icon: <Store size={14} /> },
        { label: "Rest Spot", href: "#", icon: <MapPin size={14} /> },
        {
          label: "Wall mart",
          href: "#",
          icon: <Store size={14} />,
          className: "text-red-500 font-bold",
        },
        {
          label: "More Services▸",
          icon: <Truck size={14} />,
          subLinks: [
            { label: "Towing", href: "#", icon: <Car size={12} /> },
            { label: "Truck Wash", href: "#", icon: <Soup size={12} /> },
          ],
        },
      ],
      className: "hovernav",
    },
    {
      label: "Services",
      icon: <Wrench size={16} />,
      subLinks: [
        { label: "Repair Shops", href: "#", icon: <Wrench size={14} /> },
        { label: "Oil & Lube", href: "#", icon: <Soup size={14} /> },
        {
          label: "Truck Wash ▸",
          icon: <Truck size={12} />,
          subLinks: [
            { label: "Towing", href: "#", icon: <Car size={12} /> },
            { label: "Truck Wash", href: "#", icon: <Soup size={12} /> },
          ],
        },
        { label: "Tire Services", href: "#", icon: <Wrench size={14} /> },
      ],
      className: "lg:px-5 lg:hovernav ",
    },
    {
      label: "Traffic Cameras",
      href: "#",
      icon: <Camera size={16} />,
      className: "hovernav",
    },
    {
      label: "List Your Business",
      href: "#",
      icon: <Store size={16} />,
      className: "text-black lg:bg-[#e95800] lg:text-white lg:rounded-sm",
    },
    {
      label: "Login",
      href: "#",
      icon: <LogIn size={16} />,
      className: "text-blue-600 font-semibold",
    },
    {
      label: "Sign up",
      href: "#",
      icon: <UserPlus size={16} />,
      className: "text-[#e95800] rounded",
    },
  ];
  
  