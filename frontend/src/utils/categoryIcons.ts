import type { LucideIcon } from "lucide-react";
import {
    BookOpen,
    Car,
    ChefHat,
    CreditCard,
    Dumbbell,
    Gamepad2,
    Heart,
    HeartPulse,
    Home,
    Music,
    PawPrint,
    Plane,
    Repeat,
    Shirt,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
    Tag,
    Tv2,
    Utensils,
    Wallet,
    Zap,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  home: Home,
  car: Car,
  "heart-pulse": HeartPulse,
  "book-open": BookOpen,
  "gamepad-2": Gamepad2,
  shirt: Shirt,
  "tv-2": Tv2,
  "chef-hat": ChefHat,
  "paw-print": PawPrint,
  wallet: Wallet,
  "credit-card": CreditCard,
  tag: Tag,
  heart: Heart,
  plane: Plane,
  music: Music,
  smartphone: Smartphone,
  zap: Zap,
  repeat: Repeat,
  "shopping-bag": ShoppingBag,
  "shopping-cart": ShoppingCart,
  dumbbell: Dumbbell,
};

export function getIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? Tag;
}
