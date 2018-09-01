export interface Draggables {
  selectedDraggableId: string;
  selectedElementId: string;
  selectedDropzoneId: string;
  startingDropzoneId: string;
  startingIndex: number;
  aboveMidpoint: boolean;
  dragging: boolean;
  height: number;
  closestElementId: string;
}
