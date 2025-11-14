import React from 'react';
import ReactDOM from 'react-dom/client';
import GenericGame from './generic/GenericGame';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GenericGame />
  </React.StrictMode>
);
