import * as Record from '../recordize';
import { Draggables } from './draggables';

export class Ui extends Record.define({
  draggables: new Draggables(),
  showToolbox: true,
  loaded: false,
  saving: 0,
  isAdmin: false,
}) {}
