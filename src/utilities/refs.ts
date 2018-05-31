export function activateOnEdit(params: {
  editingBefore: boolean;
  editingNow: boolean;
  onEditChange: () => void;
}) {
  const { editingBefore, editingNow, onEditChange } = params;
  if (!editingBefore && editingNow) {
    onEditChange();
  }
}

export function selectTextFromInputRef(
  ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
) {
  if (!ref.current) return;
  ref.current.focus();
  ref.current.select();
}
