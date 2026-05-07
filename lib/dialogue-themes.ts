import {
  BriefcaseBusiness,
  Building2,
  Car,
  Coffee,
  Dumbbell,
  GraduationCap,
  Heart,
  Key,
  Landmark,
  Mail,
  Pill,
  Plane,
  Scissors,
  Search,
  Shield,
  Smartphone,
  Stethoscope,
  Train,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";

export type ScenarioTheme = {
  icon: typeof Plane;
  tile: string;
  tileText: string;
  ring: string;
  chip: string;
  chipText: string;
};

export const SCENARIO_THEMES: ScenarioTheme[] = [
  { icon: Plane,             tile: "bg-[#DCE8FF]", tileText: "text-[#155DD7]", ring: "hover:ring-[#155DD7]/30", chip: "bg-[#E8F0FE]", chipText: "text-[#155DD7]" },
  { icon: Coffee,            tile: "bg-[#FFE9D6]", tileText: "text-[#B45309]", ring: "hover:ring-[#B45309]/30", chip: "bg-[#FFF1E0]", chipText: "text-[#B45309]" },
  { icon: Stethoscope,       tile: "bg-[#FFE4E6]", tileText: "text-[#BE123C]", ring: "hover:ring-[#BE123C]/30", chip: "bg-[#FFEFF1]", chipText: "text-[#BE123C]" },
  { icon: Building2,         tile: "bg-[#E5F4EA]", tileText: "text-[#0F8A4F]", ring: "hover:ring-[#0F8A4F]/30", chip: "bg-[#EDFAF1]", chipText: "text-[#0F8A4F]" },
  { icon: BriefcaseBusiness, tile: "bg-[#EDE9FE]", tileText: "text-[#6D28D9]", ring: "hover:ring-[#6D28D9]/30", chip: "bg-[#F5F1FF]", chipText: "text-[#6D28D9]" },
  { icon: Key,               tile: "bg-[#FEF3C7]", tileText: "text-[#A16207]", ring: "hover:ring-[#A16207]/30", chip: "bg-[#FEF7DA]", chipText: "text-[#A16207]" },
  { icon: Pill,              tile: "bg-[#FCE7F3]", tileText: "text-[#BE185D]", ring: "hover:ring-[#BE185D]/30", chip: "bg-[#FDEFF7]", chipText: "text-[#BE185D]" },
  { icon: Train,             tile: "bg-[#CFFAFE]", tileText: "text-[#0E7490]", ring: "hover:ring-[#0E7490]/30", chip: "bg-[#E0FAFD]", chipText: "text-[#0E7490]" },
  { icon: UtensilsCrossed,   tile: "bg-[#FEE2E2]", tileText: "text-[#B91C1C]", ring: "hover:ring-[#B91C1C]/30", chip: "bg-[#FEECEC]", chipText: "text-[#B91C1C]" },
  { icon: Landmark,          tile: "bg-[#E0E7FF]", tileText: "text-[#4338CA]", ring: "hover:ring-[#4338CA]/30", chip: "bg-[#EBF0FF]", chipText: "text-[#4338CA]" },
  { icon: Car,               tile: "bg-[#FFEDD5]", tileText: "text-[#C2410C]", ring: "hover:ring-[#C2410C]/30", chip: "bg-[#FFF3DF]", chipText: "text-[#C2410C]" },
  { icon: Mail,              tile: "bg-[#DBEAFE]", tileText: "text-[#1D4ED8]", ring: "hover:ring-[#1D4ED8]/30", chip: "bg-[#E5EEFE]", chipText: "text-[#1D4ED8]" },
  { icon: Smartphone,        tile: "bg-[#D1FAE5]", tileText: "text-[#047857]", ring: "hover:ring-[#047857]/30", chip: "bg-[#DBFBEC]", chipText: "text-[#047857]" },
  { icon: Wifi,              tile: "bg-[#E0F2FE]", tileText: "text-[#0369A1]", ring: "hover:ring-[#0369A1]/30", chip: "bg-[#EAF6FE]", chipText: "text-[#0369A1]" },
  { icon: Scissors,          tile: "bg-[#FAE8FF]", tileText: "text-[#A21CAF]", ring: "hover:ring-[#A21CAF]/30", chip: "bg-[#FBEDFF]", chipText: "text-[#A21CAF]" },
  { icon: Dumbbell,          tile: "bg-[#FEF9C3]", tileText: "text-[#854D0E]", ring: "hover:ring-[#854D0E]/30", chip: "bg-[#FEFAD3]", chipText: "text-[#854D0E]" },
  { icon: Search,            tile: "bg-[#F1F5F9]", tileText: "text-[#334155]", ring: "hover:ring-[#334155]/30", chip: "bg-[#F4F8FB]", chipText: "text-[#334155]" },
  { icon: Shield,            tile: "bg-[#E2E8F0]", tileText: "text-[#1E293B]", ring: "hover:ring-[#1E293B]/30", chip: "bg-[#EAEFF6]", chipText: "text-[#1E293B]" },
  { icon: Heart,             tile: "bg-[#FFE4E6]", tileText: "text-[#E11D48]", ring: "hover:ring-[#E11D48]/30", chip: "bg-[#FEEAEC]", chipText: "text-[#E11D48]" },
  { icon: GraduationCap,     tile: "bg-[#EDE9FE]", tileText: "text-[#5B21B6]", ring: "hover:ring-[#5B21B6]/30", chip: "bg-[#F2EEFE]", chipText: "text-[#5B21B6]" },
];
