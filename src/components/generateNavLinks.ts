'use client'
import { NavLinkItem } from "@/components/navLinks.types"; // or declare inline if needed
import { getIconByName } from "@/components/iconMap";
import placesData from "../places.json";
import servicesData from "../services.json";

function generateSection(
  key: string,
  label: string,
  iconName: string,
  data: typeof placesData
): NavLinkItem {
  return {
    key,
    label,
    icon: getIconByName(iconName, 16),
    className: "hovernav",
    subLinks: data.map((category) => ({
      key: category.label.toLowerCase().replace(/\s+/g, "-"), // ✅ Add key here
      label: category.label,
      icon: getIconByName(category.icon),
      subLinks: category.items.map((item) => ({
        key: item.id, // ✅ Already present
        id: item.id,
        label: item.name,
        href: `#${item.id}`,
        icon: getIconByName("MapPin", 12),
      })),
    })),
  };
}


export const dynamicNavLinks: NavLinkItem[] = [
  generateSection("places", "Places", "MapPin", placesData),
  generateSection("services", "Services", "Wrench", servicesData),
  {
    key: "traffic_cameras", // ✅ Add a unique key
    label: "Traffic Cameras",
    href: "#",
    icon: getIconByName("Camera", 16),
    className: "hovernav",
  },
  {
    key: "list_business", // ✅
    label: "List Your Business",
    href: "#",
    icon: getIconByName("Store", 16),
    className: "text-black lg:bg-[#e95800] lg:text-white lg:rounded-sm",
  },
  {
    key: "login", // ✅
    label: "Login",
    href: "#",
    icon: getIconByName("LogIn", 16),
    className: "text-blue-600 font-semibold",
  },
  {
    key: "signup", // ✅
    label: "Sign up",
    href: "#",
    icon: getIconByName("UserPlus", 16),
    className: "text-[#e95800] rounded",
  },
];
