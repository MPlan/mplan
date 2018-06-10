import * as Record from '../recordize';
import * as Immutable from 'immutable';
import { Draggables } from './draggables';

export class Ui extends Record.define({
  draggables: new Draggables(),
  showToolbox: true,
  loaded: false,
}) {}
