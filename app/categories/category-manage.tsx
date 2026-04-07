import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import { Database } from "@/database.types";
import { ArrowDownLeft, ArrowUpRight, Pen, Trash } from "lucide-react";
import { useState } from "react";
import { archiveCategory } from "./actions";
import { toast } from "sonner";

interface Props {
  categories: Database["public"]["Functions"]["get_user_categories"]["Returns"];
}

export default function CategoryManage({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (category_id: string) => {
    const promise = archiveCategory({ p_category_id: category_id });

    toast.promise(promise, {
      loading: "Eliminando categoria...",
      success: "Categoria eliminada",
      error: (error) => {
        return `Error al eliminar la categoria: ${error}`;
      },
    });

    setIsDeleteDialogOpen(false);
    setOpen(false);
  };

  const handleCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="w-full">
          <Pen />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Administrar cuentas</DialogTitle>
        </DialogHeader>

        {categories.map((i) => (
          <Card
            key={i.id}
            className="rounded-md data-[state=open]:bg-muted flex flex-row p-4 justify-between items-center"
          >
            <p className="w-fit">{i.name}</p>

            <div className="flex justify-end gap-2 items-center text-muted-foreground">
              <div className="flex gap-2 w-fit">
                {i.type}
                {i.type === "income" ? <ArrowDownLeft /> : <ArrowUpRight />}
              </div>
              <Button
                variant={"destructive"}
                onClick={() => setIsDeleteDialogOpen(true)}
                className=""
              >
                <Trash />
              </Button>
              <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onDelete={() => handleDelete(i.id)}
                onCancel={handleCancel}
                description="¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer. El nombre de la categoría seguirá apareciendo en transacciones pasadas."
              />
            </div>
          </Card>
        ))}
      </DialogContent>
    </Dialog>
  );
}
