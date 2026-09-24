"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  isBefore,
  isAfter,
  getYear,
  startOfMonth,
  // setMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  // Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";

interface MonthSwiperProps {
  value: string;
  onChange: (value: string) => void;
  max?: string;
}

function getMonthDate(value: string): Date {
  return value ? new Date(value + "-01T12:00:00") : startOfMonth(new Date());
}

function getLabel(date: Date): string {
  return format(date, "MMMM yyyy", { locale: es });
}

// const monthNames = Array.from({ length: 12 }, (_, i) =>
//   format(new Date(2000, i, 1), "MMM", { locale: es }),
// );

export default function MonthSwiper({
  value,
  max,
  onChange,
}: MonthSwiperProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const slideDir = useRef<"left" | "right">("right");
  const date = getMonthDate(value);
  const maxDate =
    // max
    // ? new Date(max + "-01T12:00:00")
    // :
    startOfMonth(new Date());
  // const [viewYear, setViewYear] = useState(getYear(date));

  // useEffect(() => {
  //   setViewYear(getYear(date));
  // }, [date]);

  const canGoNext = isBefore(date, maxDate);
  // const maxYear = getYear(maxDate);

  const goToPrevious = useCallback(() => {
    slideDir.current = "left";
    const newDate = subMonths(date, 1);
    onChange(format(newDate, "yyyy-MM"));
  }, [date, onChange]);

  const goToNext = useCallback(() => {
    slideDir.current = "right";
    const newDate = addMonths(date, 1);
    if (isAfter(newDate, maxDate)) return;
    onChange(format(newDate, "yyyy-MM"));
  }, [date, onChange, maxDate]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
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

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      className="flex items-center justify-center select-none py-1"
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

      <div className="flex-1 overflow-hidden text-center flex items-center justify-center ">
        <span
          key={format(date, "yyyy-MM")}
          className={`inline-block min-w-45 max-w-full text-center font-semibold text-base truncate animate-in fade-in duration-200 ${
            slideDir.current === "right"
              ? "slide-in-from-right-8"
              : "slide-in-from-left-8"
          }`}
        >
          {capitalize(getLabel(date))}
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
      </div>
    </div>
  );
}
