import { Edit } from "lucide-react";
import { ActionButton } from "./ActionButton";

interface EditActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function EditActionButton({ onClick, disabled }: EditActionButtonProps) {
  return (
    <ActionButton
      icon={Edit}
      onClick={onClick}
      disabled={disabled}
      variant="default"
    />
  );
}
