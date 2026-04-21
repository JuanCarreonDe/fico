"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Database } from "@/database.types";
import {
  ArrowDownLeft,
  ArrowUpRight,
  HandCoins,
  ListX,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { archiveCategory, updateCategory } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CategoryForm from "./category-form";

interface Props {
  categories: Database["public"]["Functions"]["get_user_categories"]["Returns"];
}

export default function CategoryManage({ categories }: Props) {
  const router = useRouter();
  const [listOpen, setListOpen] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    | Database["public"]["Functions"]["get_user_categories"]["Returns"][number]
    | null
  >(null);
  const [budgetValue, setBudgetValue] = useState("");

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Sin asignar";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const openBudgetDialog = (
    category: Database["public"]["Functions"]["get_user_categories"]["Returns"][number],
  ) => {
    setSelectedCategory(category);
    setBudgetValue(category.budget.toString() || "");
    setBudgetDialogOpen(true);
    setListOpen(false);
  };

  const openDeleteDialog = (
    category: Database["public"]["Functions"]["get_user_categories"]["Returns"][number],
  ) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
    setListOpen(false);
  };

  const handleSaveBudget = async () => {
    if (!selectedCategory) return;

    const budget = budgetValue ? parseFloat(budgetValue) : null;

    try {
      await updateCategory({
        p_category_id: selectedCategory.id,
        p_name: selectedCategory.name,
        p_type: selectedCategory.type,
        p_budget: budget ?? undefined,
      });
      toast.success("Presupuesto actualizado");
      router.refresh();
    } catch (error) {
      toast.error(`Error al actualizar el presupuesto: ${error}`);
    }

    setBudgetDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    await toast.promise(
      archiveCategory({ p_category_id: selectedCategory.id }),
      {
        loading: "Eliminando categoría...",
        success: "Categoría eliminada",
        error: (err) => `Error al eliminar la categoría: ${err}`,
      },
    );

    setDeleteDialogOpen(false);
    setSelectedCategory(null);
    router.refresh();
  };

  return (
    <>
      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full transition-opacity duration-300 animate-in fade-in"
          >
            <ListX />
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Categorías</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 max-h-100 overflow-y-auto">
            {categories.map((i) => (
              <Card
                key={i.id}
                className="rounded-md flex flex-row p-3 justify-between items-center hover:bg-muted/50 transition-colors"
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => openDeleteDialog(i)}
                >
                  <div
                    className={`p-2 rounded-full ${i.type === "income" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                  >
                    {i.type === "income" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{i.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {i.type === "income" ? "Ingreso" : "Gasto"}
                    </span>
                  </div>
                </div>

                {i.type === "expense" && (
                  <div
                    className="flex items-center gap-2 text-sm cursor-pointer px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      openBudgetDialog(i);
                    }}
                  >
                    <HandCoins className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-500 font-medium">
                      {formatCurrency(i.budget)}
                    </span>
                  </div>
                )}
              </Card>
            ))}

            <Card
              className="rounded-md flex flex-row p-3 justify-between items-center hover:bg-muted/50 transition-colors cursor-pointer border-dashed"
              onClick={() => {
                setListOpen(false);
                setAddCategoryOpen(true);
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-full bg-muted">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="font-medium text-muted-foreground">
                  Agregar categoría
                </span>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={budgetDialogOpen}
        onOpenChange={(open) => {
          setBudgetDialogOpen(open);
          if (!open) setListOpen(true);
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-full bg-amber-500/10">
                <HandCoins className="h-5 w-5 text-amber-500" />
              </div>
              Presupuesto
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="text-sm text-muted-foreground">Categoría: </span>
              <span className="font-medium">{selectedCategory?.name}</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nuevo presupuesto mensual
              </label>
              <Input
                type="number"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
                placeholder="0.00"
                className="text-lg"
              />
            </div>

            <div className="flex items-center justify-between text-sm bg-muted/30 p-2 rounded">
              <span className="text-muted-foreground">Actual:</span>
              <span className="font-medium">
                {formatCurrency(selectedCategory?.budget ?? null)}
              </span>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setBudgetDialogOpen(false);
                setListOpen(true);
              }}
            >
              Cancelar
            </Button>
            <Button variant="accent" onClick={handleSaveBudget}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setListOpen(true);
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-full bg-red-500/10">
                <ArrowUpRight className="h-5 w-5 text-red-500" />
              </div>
              Eliminar categoría
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="text-sm text-muted-foreground">Categoría: </span>
              <span className="font-medium">{selectedCategory?.name}</span>
            </div>

            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de que quieres eliminar esta categoría? Esta acción
              no se puede deshacer. El nombre de la categoría seguirá
              apareciendo en transacciones pasadas.
            </p>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setListOpen(true);
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CategoryForm
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
        buttonClassName="hidden"
        buttonText=""
        variant="default"
      />
    </>
  );
}
