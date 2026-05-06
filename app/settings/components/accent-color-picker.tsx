"use client";

import * as React from "react";
import { createClient } from "@/lib/db/client";
import { useAuth } from "@/components/auth-provider";
import { ColorPicker } from "@/components/ui/color-picker";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccentColorPicker() {
  const { user } = useAuth();
  const supabase = React.useMemo(() => createClient(), []);

  const [color, setColor] = React.useState("#ff7301");
  const [loading, setLoading] = React.useState(true);

  const colorRef = React.useRef("#ff7301");
  const initialColorRef = React.useRef("#ff7301");
  const pendingSavedRef = React.useRef("#ff7301");
  const isMountedRef = React.useRef(true);

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

  // Fetch inicial
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
      colorRef.current = savedColor;
      initialColorRef.current = savedColor;
      pendingSavedRef.current = savedColor;
      document.documentElement.style.setProperty("--accent", savedColor);
      setLoading(false);
    }

    fetchAccentColor();
  }, [user, supabase]);

  // Cleanup al unmount - guardar si hay cambios pendientes
  React.useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      const currentColor = colorRef.current;
      const initialColor = initialColorRef.current;
      const savedColor = pendingSavedRef.current;

      if (currentColor !== initialColor && currentColor !== savedColor) {
        saveToDb(currentColor);
      }
    };
  }, [saveToDb]);

  // Debounce para guardar
  React.useEffect(() => {
    if (loading) return;
    if (color === pendingSavedRef.current) return;

    const timer = setTimeout(async () => {
      await saveToDb(color);
      pendingSavedRef.current = color;
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [color, loading, saveToDb]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    colorRef.current = newColor;
    document.documentElement.style.setProperty("--accent", newColor);
  };

  if (loading) {
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

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">Color de acento</span>
      <div className="w-fit flex items-center gap-2">
        <ColorPicker value={color} onChange={handleColorChange} />
      </div>
    </div>
  );
}
