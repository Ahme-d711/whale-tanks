import React from "react";
import { Trash2 } from "lucide-react";
import { ActionButton } from "./ActionButton";

interface DeleteActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function DeleteActionButton({ onClick, disabled }: DeleteActionButtonProps) {
  return (
    <ActionButton
      icon={Trash2}
      onClick={onClick}
      disabled={disabled}
      variant="danger"
    />
  );
}
