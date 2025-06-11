import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import rootReducer from './reducers/index'; // Sesuaikan path
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import App from './App';

const store = createStore(rootReducer, applyMiddleware(thunk));

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