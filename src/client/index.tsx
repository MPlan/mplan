import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'normalize.css';
require('@fortawesome/fontawesome-pro-regular');
import { App } from './app';

const bootstrap = document.createElement('div');
document.body.appendChild(bootstrap);
ReactDOM.render(<App />, bootstrap);

async function testService() {
  const response = await fetch('/api/test');
  const data = await response.json();

  console.log('data from server', data);
}

testService();