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
  constructor(props?: any) {
    super(props);
  }
  static updateStore(store: App, newThis: Draggables) {
    return store.update('ui', ui => ui.set('draggables', newThis));
  }
}
