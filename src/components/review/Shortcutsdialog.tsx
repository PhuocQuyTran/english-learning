import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SHORTCUTS } from "@/constants";

interface ShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShortcutsDialog({ open, onOpenChange }: ShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Use these shortcuts while reviewing your vocabulary cards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {SHORTCUTS.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2 text-sm"
            >
              <span className="font-medium text-foreground">{label}</span>
              <kbd className="rounded border bg-background px-2 py-1 text-xs font-semibold shadow-sm">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShortcutsDialog;
