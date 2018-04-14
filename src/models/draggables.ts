import * as Record from '../recordize';

export class Draggables extends Record.define({
  selectedDraggableId: '',
  selectedElementId: '',
  selectedDropzoneId: '',
  startingDropzoneId: '',
  startingIndex: 0,
  aboveMidpoint: false,
  dragging: false,
  height: 0,
  closestElementId: '',
}) {}
