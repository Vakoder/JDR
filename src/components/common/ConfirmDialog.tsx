import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmer la suppression',
  message,
  confirmLabel = 'Supprimer',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
          <AlertTriangle size={22} className="text-red-400" />
        </div>
        <p className="text-slate-400 text-sm">{message}</p>
        <div className="flex gap-3 w-full justify-center">
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  );
}
