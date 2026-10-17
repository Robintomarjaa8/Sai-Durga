"use client";

import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  Check,
  FileCheck2,
  MapPin,
  MessageCircle,
  Settings2,
  ShieldCheck,
} from "lucide-react";

const icons = {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  Check,
  FileCheck2,
  MapPin,
  MessageCircle,
  Settings2,
  ShieldCheck,
};

export type IconName = keyof typeof icons;

export function Icon({ name, size = 18, className }: { name: IconName; size?: number; className?: string }) {
  const IconComponent = icons[name];
  return <IconComponent size={size} className={className} aria-hidden="true" focusable="false" />;
}
