import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";

interface DeleteOrderDialogProps {
  confirmOrderId: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteOrderDialog({ confirmOrderId, onClose, onConfirm }: DeleteOrderDialogProps) {
  return (
    <AlertDialog open={!!confirmOrderId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent className="max-w-sm rounded-[2rem] p-0 overflow-hidden">
        <div className="p-8 space-y-5">
          <AlertDialogHeader className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-black text-center">حذف الطلب</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground">
              هل أنت متأكد من حذف هذا الطلب؟
              <br />
              <span className="font-mono text-xs text-primary">#{confirmOrderId?.slice(0, 12)}</span>
              <br />
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-3 !mt-0">
            <Button
              className="flex-1 bg-destructive hover:bg-destructive/90 text-white rounded-2xl py-5 font-bold"
              onClick={onConfirm}
            >
              <Trash2 className="w-4 h-4 ml-1" />
              حذف نهائياً
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-2xl py-5 font-bold border-border/50"
              onClick={onClose}
            >
              إلغاء
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
