import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Provider } from 'react-redux';
// Impor yang sesuai dengan file index.js Anda
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './store/rootReducer'; // Mengimpor semua reducer

import App from './App';
// Kita juga perlu mengimpor EventCalendar karena App me-rendernya.
// Jest akan menggunakan versi tiruan (mock) secara otomatis.
import EventCalendar from './containers/eventCalendar';

// Mock komponen child agar kita bisa fokus menguji App saja.
jest.mock('./containers/eventCalendar', () => () => <div>EventCalendarMock</div>);


// --- HELPER UNTUK RENDER DENGAN REDUX ---
const renderWithProviders = (
  ui,
  {
    initialState = {},
    // Membuat store baru untuk setiap tes sesuai dengan setup Anda
    store = createStore(combineReducers(reducers), initialState, applyMiddleware(thunk)),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};


// --- TES UNTUK APP.JS ---

describe('App Component', () => {
  
  // Tes dasar untuk memastikan aplikasi bisa render tanpa error
  it('renders without crashing', () => {
    const { unmount } = renderWithProviders(<App />);
    unmount();
  });
  
  // Tes untuk memverifikasi konten utama dari App.js
  it('should render the main header', () => {
    renderWithProviders(<App />);
    
    // Cari elemen heading yang berisi teks "Event Calendar"
    const headerElement = screen.getByRole('heading', { name: /Event Calendar/i });
    expect(headerElement).toBeInTheDocument();
  });

  // Tes untuk memastikan komponen EventCalendar dipanggil
  it('should render the EventCalendar component', () => {
    renderWithProviders(<App />);

    // Verifikasi bahwa komponen mock kita ada di dalam dokumen.
    // Ini membuktikan bahwa App.js sudah benar memanggil EventCalendar.
    expect(screen.getByText('EventCalendarMock')).toBeInTheDocument();
  });

});
