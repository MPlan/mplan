import * as Record from '../recordize';
import { App } from 'models';

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
}) {
  updateStore = (store: App) => {
    return store.update('ui', ui => ui.set('draggables', this));
  };
}
