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
import { LogOut } from "lucide-react";

export type LogoutConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
};

export function LogoutConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: LogoutConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <LogOut className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-text-primary">Log out</DialogTitle>
              <DialogDescription className="text-text-secondary mt-4">
                Are you sure you want to log out of the admin dashboard?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="text-text-secondary"
          >
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Log out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

