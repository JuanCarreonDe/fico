"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface ColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  presets?: string[];
}

const DEFAULT_PRESETS = [
  "#ff7301", // orange (default)
  "#3b82f6", // blue
  "#10b981", // green
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
];

export function ColorPicker({
  className,
  presets = DEFAULT_PRESETS,
  value,
  onChange,
  ...props
}: ColorPickerProps) {
  const [currentColor, setCurrentColor] = React.useState(value || "#ff7301");

  React.useEffect(() => {
    if (value) {
      setCurrentColor(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    onChange?.(e);
  };

  return (
    <div className="space-y-2 max-w-25">
      <div className="flex items-center justify-end gap-2">
        <div
          className="relative h-12 w-12 rounded-md overflow-hidden shrink-0"
          style={{ ["backgroundColor" as string]: currentColor }}
        >
          <Input
            type="color"
            value={currentColor}
            onChange={handleChange}
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer p-0"
            {...props}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2 ">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => {
              setCurrentColor(color);
              const event = {
                target: { value: color },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange?.(event);
            }}
            className={cn(
              "h-6 w-6 rounded-md border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              currentColor === color
                ? "border-foreground"
                : "border-transparent",
            )}
            style={{ ["backgroundColor" as string]: color }}
            aria-label={`Seleccionar color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
