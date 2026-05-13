import { 
  Plane, Coffee, Stethoscope, Building2, Briefcase, Key, Pill, 
  TrainFront, Utensils, Landmark, Car, Mail, Smartphone, Wifi, 
  Scissors, Dumbbell, Search, Shield, Heart, GraduationCap 
} from "lucide-react";

export type ScenarioTheme = {
  icon: any;
  tile: string;
  tileText: string;
  ring: string;
  chip: string;
  chipText: string;
};

export const SCENARIO_THEMES: ScenarioTheme[] = [
  { icon: Plane,          tile: "bg-emerald-50",  tileText: "text-emerald-700", ring: "hover:ring-emerald-600/30", chip: "bg-emerald-50", chipText: "text-emerald-700" },
  { icon: Coffee,         tile: "bg-amber-50",    tileText: "text-amber-700",   ring: "hover:ring-amber-600/30",   chip: "bg-amber-50",   chipText: "text-amber-700" },
  { icon: Stethoscope,    tile: "bg-rose-50",     tileText: "text-rose-700",    ring: "hover:ring-rose-600/30",    chip: "bg-rose-50",    chipText: "text-rose-700" },
  { icon: Building2,      tile: "bg-teal-50",     tileText: "text-teal-700",    ring: "hover:ring-teal-600/30",    chip: "bg-teal-50",    chipText: "text-teal-700" },
  { icon: Briefcase,      tile: "bg-orange-50",   tileText: "text-orange-700",  ring: "hover:ring-orange-600/30",  chip: "bg-orange-50",  chipText: "text-orange-700" },
  { icon: Key,            tile: "bg-amber-50",    tileText: "text-amber-800",   ring: "hover:ring-amber-700/30",   chip: "bg-amber-50",   chipText: "text-amber-800" },
  { icon: Pill,           tile: "bg-rose-50",     tileText: "text-rose-800",    ring: "hover:ring-rose-700/30",    chip: "bg-rose-50",    chipText: "text-rose-800" },
  { icon: TrainFront,     tile: "bg-teal-50",     tileText: "text-teal-800",    ring: "hover:ring-teal-700/30",    chip: "bg-teal-50",    chipText: "text-teal-800" },
  { icon: Utensils,       tile: "bg-orange-50",   tileText: "text-orange-800",  ring: "hover:ring-orange-700/30",  chip: "bg-orange-50",  chipText: "text-orange-800" },
  { icon: Landmark,       tile: "bg-emerald-50",  tileText: "text-emerald-800", ring: "hover:ring-emerald-700/30", chip: "bg-emerald-50", chipText: "text-emerald-800" },
  { icon: Car,            tile: "bg-amber-50",    tileText: "text-amber-700",   ring: "hover:ring-amber-600/30",   chip: "bg-amber-50",   chipText: "text-amber-700" },
  { icon: Mail,           tile: "bg-teal-50",     tileText: "text-teal-700",    ring: "hover:ring-teal-600/30",    chip: "bg-teal-50",    chipText: "text-teal-700" },
  { icon: Smartphone,     tile: "bg-emerald-50",  tileText: "text-emerald-700", ring: "hover:ring-emerald-600/30", chip: "bg-emerald-50", chipText: "text-emerald-700" },
  { icon: Wifi,           tile: "bg-orange-50",   tileText: "text-orange-700",  ring: "hover:ring-orange-600/30",  chip: "bg-orange-50",  chipText: "text-orange-700" },
  { icon: Scissors,       tile: "bg-rose-50",     tileText: "text-rose-700",    ring: "hover:ring-rose-600/30",    chip: "bg-rose-50",    chipText: "text-rose-700" },
  { icon: Dumbbell,       tile: "bg-amber-50",    tileText: "text-amber-800",   ring: "hover:ring-amber-700/30",   chip: "bg-amber-50",   chipText: "text-amber-800" },
  { icon: Search,         tile: "bg-stone-50",    tileText: "text-stone-700",   ring: "hover:ring-stone-600/30",   chip: "bg-stone-50",   chipText: "text-stone-700" },
  { icon: Shield,         tile: "bg-slate-50",    tileText: "text-slate-700",   ring: "hover:ring-slate-600/30",   chip: "bg-slate-50",   chipText: "text-slate-700" },
  { icon: Heart,          tile: "bg-rose-50",     tileText: "text-rose-600",    ring: "hover:ring-rose-500/30",    chip: "bg-rose-50",    chipText: "text-rose-600" },
  { icon: GraduationCap,  tile: "bg-emerald-50",  tileText: "text-emerald-700", ring: "hover:ring-emerald-600/30", chip: "bg-emerald-50", chipText: "text-emerald-700" },
];
