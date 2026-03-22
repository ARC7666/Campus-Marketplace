import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);
