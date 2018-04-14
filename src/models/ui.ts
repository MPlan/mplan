import * as Record from '../recordize';
import { Draggables } from './draggables';

export class Ui extends Record.define({
  draggables: new Draggables(),
  showToolbox: true,
}) {}
