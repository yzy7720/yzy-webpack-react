import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if ((module as any).hot) {
  (module as any).hot.accept();
}

// eslint-disable-next-line jsx-quotes
ReactDOM.render(<App name="vortesnail" age={25} />, document.querySelector('#root'));
