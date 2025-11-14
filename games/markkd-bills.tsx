import React from 'react';
import ReactDOM from 'react-dom/client';
import MarkkdBillsGame from './markkd-bills/MarkkdBillsGame';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <MarkkdBillsGame />
  </React.StrictMode>
);
