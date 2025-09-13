import "./confirm-dialog.css";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog-box">
        <p>{message}</p>
        <div className="confirm-dialog-buttons">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="btn-primary">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
