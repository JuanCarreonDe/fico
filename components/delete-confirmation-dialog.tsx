"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  deleteButtonText?: string;
  cancelButtonText?: string;
}

export function DeleteConfirmationDialog({
  isOpen,
  onOpenChange,
  onDelete,
  onCancel,
  title = "Confirmar Eliminación",
  description = "¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.",
  deleteButtonText = "Sí, eliminar",
  cancelButtonText = "No, cancelar",
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {cancelButtonText}
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            {deleteButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
