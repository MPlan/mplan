import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'normalize.css';
import './global';
import { App } from 'components/app';

const bootstrap = document.createElement('div');
document.body.appendChild(bootstrap);
ReactDOM.render(<App />, bootstrap);
