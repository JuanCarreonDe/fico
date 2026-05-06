"use client";

import * as React from "react";
import { createClient } from "@/lib/db/client";
import { useAuth } from "@/components/auth-provider";
import { ColorPicker } from "@/components/ui/color-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function ColorPickerSkeleton() {
  return (
    <div className="flex items-start justify-between py-2">
      <span className="text-sm">Color de acento</span>
      <div className="w-fit flex items-center gap-2">
        <div className="space-y-2 max-w-25">
          <div className="flex items-center justify-end gap-2">
            <Skeleton className="h-12 w-12 rounded-md" />
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-6 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccentColorPicker() {
  const { user } = useAuth();
  const supabase = React.useMemo(() => createClient(), []);

  const [color, setColor] = React.useState("#ff7301");
  const [initialColor, setInitialColor] = React.useState("#ff7301");
  const [loading, setLoading] = React.useState(true);
  const pendingSavedRef = React.useRef("#ff7301");

  const saveToDb = React.useCallback(
    async (colorToSave: string) => {
      if (!user?.id) return;

      const toastId = toast.loading("Guardando color...");

      const { error } = await supabase
        .from("profiles")
        .upsert(
          { id: user.id, accent_color: colorToSave },
          { onConflict: "id" },
        );

      if (error) {
        toast.error("Error al guardar el color", { id: toastId });
      } else {
        toast.success("Color guardado", { id: toastId });
      }
    },
    [user, supabase],
  );

  React.useEffect(() => {
    async function fetchAccentColor() {
      if (!user?.id) return;

      const { data } = await supabase
        .from("profiles")
        .select("accent_color")
        .eq("id", user.id)
        .single();

      const savedColor = data?.accent_color || "#ff7301";
      setColor(savedColor);
      setInitialColor(savedColor);
      pendingSavedRef.current = savedColor;
      document.documentElement.style.setProperty("--accent", savedColor);
      setLoading(false);
    }

    fetchAccentColor();
  }, [user, supabase]);

  React.useEffect(() => {
    if (color === pendingSavedRef.current) return;

    const timer = setTimeout(async () => {
      await saveToDb(color);
      pendingSavedRef.current = color;
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [color, saveToDb]);

  React.useEffect(() => {
    return () => {
      if (color !== initialColor && color !== pendingSavedRef.current) {
        saveToDb(color);
      }
    };
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    document.documentElement.style.setProperty("--accent", newColor);
  };

  if (loading) {
    return <ColorPickerSkeleton />;
  }

  return (
    <div className="flex items-start justify-between py-2">
      <span className="text-sm">Color de acento</span>
      <div className="w-fit flex items-center gap-2">
        <ColorPicker value={color} onChange={handleColorChange} />
      </div>
    </div>
  );
}
