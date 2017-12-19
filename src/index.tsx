import * as React from 'react';
import * as ReactDom from 'react-dom';

const bootstrap = document.createElement('div');
document.body.appendChild(bootstrap);

ReactDom.render(<div>hello from react</div>, bootstrap);