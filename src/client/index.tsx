import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'normalize.css';
import { App } from './app';

const bootstrap = document.createElement('div');
document.body.appendChild(bootstrap);
ReactDOM.render(<App />, bootstrap);
