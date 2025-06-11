// src/App.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
// Sekarang kita bisa menggunakan default import tanpa kurung kurawal, karena rootReducer.js sudah benar
import rootReducer from './store/rootReducer'; 

const store = createStore(rootReducer);

it('renders without crashing', () => {
  const div = document.createElement('div');
  
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  );
  
  ReactDOM.unmountComponentAtNode(div);
});