import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './store/rootReducer'; 
import * as types from './store/eventActionTypes'; 
import * as eventAction from './store/eventAction';

import EventCalendar from './containers/eventCalendar';

// --- MOCKING ---

// 1. Mock komponen child `EventDetails` dengan lebih interaktif.
// Sekarang kita bisa mensimulasikan klik tombol di dalam modal.
jest.mock('./containers/eventDetails', () => (props) => (
  <div data-testid="event-details-mock">
    <p>Modal Visible: {props.showModal.toString()}</p>
    <p>Event Type: {props.eventType}</p>
    {/* Tombol-tombol ini memungkinkan kita memanggil fungsi dari props */}
    <button onClick={() => props.addEvent({ id: 99, title: 'Added Event' })}>Add Event</button>
    <button onClick={() => props.updateEvent({ id: 100, title: 'Updated Event' })}>Update Event</button>
    <button onClick={() => props.deleteEvent(101)}>Delete Event</button>
  </div>
));

// 2. Mock `react-big-calendar` dengan lebih lengkap untuk mengatasi error.
jest.mock('react-big-calendar', () => {
    const MockedBigCalendar = (props) => (
        <div data-testid="big-calendar-mock">
            <button onClick={() => props.onSelectSlot({ start: new Date(), end: new Date() })}>
                Select Slot
            </button>
            <button onClick={() => props.onSelectEvent({ id: 1, title: 'Existing Event' })}>
                Select Event
            </button>
        </div>
    );
    // FIX: Tambahkan properti statis yang dipanggil di eventCalendar.js
    MockedBigCalendar.momentLocalizer = jest.fn();
    MockedBigCalendar.Views = { MONTH: 'month', WEEK: 'week', DAY: 'day', AGENDA: 'agenda' };

    return MockedBigCalendar;
});

// --- HELPER RENDER ---
const renderWithProviders = (
  ui,
  {
    initialState = { events: { allEvents: [] } },
    store = createStore(combineReducers(reducers), initialState, applyMiddleware(thunk)),
    ...renderOptions
  } = {}
) => {
  store.dispatch = jest.fn(); 
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// --- TES UNTUK EVENTCALENDAR.JS ---

describe('EventCalendar Component', () => {

  it('renders instructions and calendar correctly', () => {
    renderWithProviders(<EventCalendar />);
    expect(screen.getByText('To add an event:', { exact: false })).toBeInTheDocument();
    expect(screen.getByTestId('big-calendar-mock')).toBeInTheDocument();
  });

  it('dispatches GetInitialEvents action on mount', () => {
    const getInitialEventsSpy = jest.spyOn(eventAction, 'GetInitialEvents').mockReturnValue({ type: 'GET_DUMMY_EVENTS' });
    const { store } = renderWithProviders(<EventCalendar />);
    expect(store.dispatch).toHaveBeenCalledWith(eventAction.GetInitialEvents());
    getInitialEventsSpy.mockRestore();
  });

  it('opens the "add" modal when a calendar slot is selected', () => {
    renderWithProviders(<EventCalendar />);
    expect(screen.getByText('Modal Visible: false')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Select Slot/i }));
    expect(screen.getByText('Modal Visible: true')).toBeInTheDocument();
    expect(screen.getByText('Event Type: add')).toBeInTheDocument();
  });

  it('opens the "edit" modal when an event is selected', () => {
    renderWithProviders(<EventCalendar />);
    fireEvent.click(screen.getByRole('button', { name: /Select Event/i }));
    expect(screen.getByText('Modal Visible: true')).toBeInTheDocument();
    expect(screen.getByText('Event Type: edit')).toBeInTheDocument();
  });

  // FIX: Menguji dengan cara yang lebih baik, tanpa mengakses detail internal React
  it('dispatches ADD_EVENT action when addEvent is called from EventDetails', () => {
    const { store } = renderWithProviders(<EventCalendar />);
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }));
    expect(store.dispatch).toHaveBeenCalledWith({
      type: types.ADD_EVENT,
      payload: { id: 99, title: 'Added Event' }
    });
  });

  it('dispatches REMOVE_EVENT action when deleteEvent is called from EventDetails', () => {
    const { store } = renderWithProviders(<EventCalendar />);
    fireEvent.click(screen.getByRole('button', { name: /Delete Event/i }));
    expect(store.dispatch).toHaveBeenCalledWith({
      type: types.REMOVE_EVENT,
      payload: 101
    });
  });

  it('dispatches UPDATE_EVENT action when updateEvent is called from EventDetails', () => {
    const { store } = renderWithProviders(<EventCalendar />);
    fireEvent.click(screen.getByRole('button', { name: /Update Event/i }));
    expect(store.dispatch).toHaveBeenCalledWith({
      type: types.UPDATE_EVENT,
      payload: { id: 100, obj: { id: 100, title: 'Updated Event' } }
    });
  });
});
