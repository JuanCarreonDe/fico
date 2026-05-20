"use client";

import {
  CATEGORY_ICONS,
  CATEGORY_ICON_SECTIONS,
} from "@/lib/get-category-icon";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value: string | null;
  onChange: (iconName: string | null) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="space-y-3">
      {CATEGORY_ICON_SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            {section.label}
          </p>
          <div className="grid grid-cols-8 gap-1">
            {section.icons.map((name) => {
              const Icon = CATEGORY_ICONS[name];
              const isSelected = value === name;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onChange(isSelected ? null : name)}
                  className={cn(
                    "flex items-center justify-center p-2 rounded-md transition-colors",
                    "hover:bg-muted cursor-pointer",
                    isSelected &&
                      "bg-accent text-accent-foreground ring-2 ring-accent",
                  )}
                  title={name}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
