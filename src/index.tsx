import * as React from 'react';
import * as ReactDom from 'react-dom';
import 'normalize.css';
require('@fortawesome/fontawesome');
require('@fortawesome/fontawesome-pro-regular');
import { App } from './app';

const bootstrap = document.createElement('div');
document.body.appendChild(bootstrap);
ReactDom.render(<App />, bootstrap);
