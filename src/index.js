import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import * as reducers from './store/rootReducer';
const store = createStore(combineReducers(reducers), applyMiddleware(thunk))

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// ✅ Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(function (registration) {
      console.log('✅ Service Worker Registered!', registration);
    })
    .catch(function (err) {
      console.error('❌ Service Worker registration failed: ', err);
    });
}

// ✅ Minta Permission Notifikasi
Notification.requestPermission().then(function (permission) {
  if (permission === "granted") {
    console.log("✅ Notifikasi diizinkan");
  } else {
    console.log("❌ Notifikasi ditolak");
  }
});
