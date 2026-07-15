"use client";

import { useCallback, useRef } from "react";
import {
  addDays,
  format,
  isBefore,
  isSameDay,
  startOfDay,
  subDays,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateSwiperProps {
  value: string;
  onChange: (value: string) => void;
}

const LABELS: Record<number, string> = {
  0: "Hoy",
  [-1]: "Ayer",
  [-2]: "Antier",
};

function getLabel(date: Date): string {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays in LABELS) {
    return LABELS[diffDays];
  }

  const formatted = format(date, "EEEE d MMM", { locale: es });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export default function DateSwiper({ value, onChange }: DateSwiperProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const slideDir = useRef<"left" | "right">("right");

  const today = startOfDay(new Date());
  const date = value ? startOfDay(new Date(value + "T12:00:00")) : today;

  const canGoNext = isBefore(date, today);

  const goToPrevious = useCallback(() => {
    slideDir.current = "left";
    const newDate = subDays(date, 1);
    onChange(format(newDate, "yyyy-MM-dd"));
  }, [date, onChange]);

  const goToNext = useCallback(() => {
    slideDir.current = "right";
    const newDate = addDays(date, 1);
    if (!isBefore(newDate, today) && !isSameDay(newDate, today)) return;
    onChange(format(newDate, "yyyy-MM-dd"));
  }, [date, onChange, today]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;

      if (Math.abs(deltaX) < 30) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    },
    [goToPrevious, goToNext],
  );

  return (
    <div>
      <FieldLabel className="text-muted-foreground">Fecha</FieldLabel>
      <div
        className="flex items-center select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          className="shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 overflow-hidden">
          <span
            key={format(date, "yyyy-MM-dd")}
            className={`block text-center font-semibold text-base truncate animate-in fade-in duration-200 ${
              slideDir.current === "right"
                ? "slide-in-from-right-8"
                : "slide-in-from-left-8"
            }`}
          >
            {getLabel(date)}
          </span>
        </div>

        <div className="flex items-center shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={!canGoNext}
            className="shrink-0"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
              >
                <CalendarIcon className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (d) {
                    onChange(format(d, "yyyy-MM-dd"));
                  }
                }}
                disabled={(d) => isBefore(today, startOfDay(d))}
                locale={es}
                className="m-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
