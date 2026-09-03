"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Database } from "@/database.types";
import { formatCurrency } from "@/lib/format-currency";
import { HandCoins, ListX, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { archiveCategory, updateCategory } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CategoryForm from "./category-form";
import IconPicker from "@/components/icon-picker";
import { CategoryIconDisplay } from "@/lib/get-category-icon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface Props {
  categories: Database["public"]["Functions"]["get_user_categories"]["Returns"];
}

export default function CategoryManage({ categories }: Props) {
  const router = useRouter();
  const [listOpen, setListOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    | Database["public"]["Functions"]["get_user_categories"]["Returns"][number]
    | null
  >(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<"income" | "expense">("expense");
  const [editIcon, setEditIcon] = useState<string>("Tags");
  const [editBudget, setEditBudget] = useState("");
  const [budgetValue, setBudgetValue] = useState("");

  const openEditDialog = (
    category: Database["public"]["Functions"]["get_user_categories"]["Returns"][number],
  ) => {
    setSelectedCategory(category);
    setEditName(category.name);
    setEditType(category.type as "income" | "expense");
    setEditIcon(category.icon ?? "Tags");
    setEditBudget(category.budget?.toString() ?? "");
    setEditDialogOpen(true);
    setListOpen(false);
  };

  const openBudgetDialog = (
    category: Database["public"]["Functions"]["get_user_categories"]["Returns"][number],
  ) => {
    setSelectedCategory(category);
    setBudgetValue(category.budget?.toString() ?? "");
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

  const handleSaveEdit = async () => {
    if (!selectedCategory) return;

    const categoryId = selectedCategory.id;
    setEditDialogOpen(false);
    setListOpen(true);

    const budget = editBudget ? parseFloat(editBudget) : null;

    await toast.promise(
      updateCategory({
        p_category_id: categoryId,
        p_name: editName,
        p_type: editType,
        p_icon: editIcon,
        p_budget: budget ?? undefined,
      }),
      {
        loading: "Actualizando categoría...",
        success: "Categoría actualizada",
        error: (err) => `Error al actualizar: ${err}`,
      },
    );

    setSelectedCategory(null);
    router.refresh();
  };

  const handleSaveBudget = async () => {
    if (!selectedCategory) return;

    const categoryId = selectedCategory.id;
    setBudgetDialogOpen(false);

    const budget = budgetValue ? parseFloat(budgetValue) : null;

    await toast.promise(
      updateCategory({
        p_category_id: categoryId,
        p_name: selectedCategory.name,
        p_type: selectedCategory.type,
        p_budget: budget ?? undefined,
      }),
      {
        loading: "Actualizando presupuesto...",
        success: "Presupuesto actualizado",
        error: (err) => `Error al actualizar el presupuesto: ${err}`,
      },
    );

    setSelectedCategory(null);
    router.refresh();
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

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressCategory = useRef<
    | Database["public"]["Functions"]["get_user_categories"]["Returns"][number]
    | null
  >(null);
  const isLongPress = useRef(false);

  const handleCardPointerDown =
    (
      category: Database["public"]["Functions"]["get_user_categories"]["Returns"][number],
    ) =>
    () => {
      longPressCategory.current = category;
      isLongPress.current = false;
      longPressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        openDeleteDialog(longPressCategory.current!);
      }, 500);
    };

  const handleCardPointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!isLongPress.current && longPressCategory.current) {
      openEditDialog(longPressCategory.current);
    }
    longPressCategory.current = null;
  };

  const handleCardPointerLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    longPressCategory.current = null;
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

          <div className="space-y-2 max-w-full overflow-hidden">
            {categories.map((i) => (
              <Card
                key={i.id}
                className="rounded-md flex flex-row p-3 justify-between items-center hover:bg-muted/50 transition-colors select-none shadow-none! max-w-full"
                onPointerDown={handleCardPointerDown(i)}
                onPointerUp={handleCardPointerUp}
                onPointerLeave={handleCardPointerLeave}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`p-2 rounded-full ${i.type === "income" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                  >
                    <CategoryIconDisplay
                      icon={i.icon}
                      type={i.type}
                      className="h-4 w-4"
                    />
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
                      {i.budget !== null
                        ? formatCurrency(i.budget)
                        : "Sin asignar"}
                    </span>
                  </div>
                )}
              </Card>
            ))}

            <Card
              className="rounded-md flex flex-row p-3 justify-between items-center hover:bg-muted/50 transition-colors cursor-pointer border-dashed shadow-none!"
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
          <DialogFooter className="rounded-md flex! flex-row p-3 justify-between items-center bg-amber-500/5 border-amber-500/20">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-full bg-amber-500/10">
                <HandCoins className="h-4 w-4 text-amber-500" />
              </div>
              <span className="font-medium">Total presupuesto</span>
            </div>
            <span className="text-amber-500 font-semibold text-sm">
              {formatCurrency(
                categories.reduce<number>((acc, cat) => {
                  if (cat.type === "expense" && cat.budget !== null) {
                    return acc + cat.budget;
                  }
                  return acc;
                }, 0),
              )}
            </span>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setListOpen(true);
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Editar categoría</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>Nombre</FieldLabel>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nombre de la categoría"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <RadioGroup
              value={editType}
              onValueChange={(value) =>
                setEditType(value as "income" | "expense")
              }
              className="flex justify-between"
            >
              {["income", "expense"].map((t) => (
                <Field orientation="horizontal" key={t}>
                  <RadioGroupItem value={t} id={`edit-${t}-category`} />
                  <FieldLabel
                    htmlFor={`edit-${t}-category`}
                    className="font-normal capitalize"
                  >
                    {t === "income" ? "Ingreso" : "Gasto"}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>

            {editType === "expense" && (
              <FieldSet>
                <FieldLabel className="text-muted-foreground">
                  Presupuesto mensual
                </FieldLabel>
                <Input
                  type="number"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  placeholder="0.00"
                />
              </FieldSet>
            )}

            <FieldSet>
              <Collapsible className="rounded-md data-[state=open]:bg-muted">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="group w-full justify-between h-auto p-2"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      Icono
                      <CategoryIconDisplay
                        icon={editIcon}
                        type={editType}
                        className="h-4 w-4"
                      />
                    </span>
                    <ChevronDown className="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2.5 pt-0">
                  <IconPicker value={editIcon} onChange={setEditIcon} />
                </CollapsibleContent>
              </Collapsible>
            </FieldSet>
          </FieldGroup>

          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setListOpen(true);
              }}
            >
              Cancelar
            </Button>
            <Button variant="accent" onClick={handleSaveEdit}>
              Guardar
            </Button>
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
                {selectedCategory?.budget != null
                  ? formatCurrency(selectedCategory.budget)
                  : "Sin asignar"}
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
                <span className="h-5 w-5 text-red-500 font-bold">!</span>
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
