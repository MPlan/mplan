import * as React from 'react';
import * as ReactDom from 'react-dom';
import { App } from './app';

const bootstrap = document.createElement('div');
document.body.appendChild(bootstrap);
ReactDom.render(<App />, bootstrap);
