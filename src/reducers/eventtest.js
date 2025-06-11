import rootReducer from './index'; // Mengimpor rootReducer sebagai default
import * as types from '../store/eventActionTypes';

describe('Root Reducer', () => {

  it('should return the initial state', () => {
    const expectedState = { events: { allEvents: [] } };
    expect(rootReducer(undefined, {})).toEqual(expectedState);
  });

  it('should handle ADD_EVENT', () => {
    const initialState = { events: { allEvents: [] } };
    const newEvent = { id: 1, title: 'Test Event' };
    const action = { type: types.ADD_EVENT, payload: newEvent };
    const expectedState = { events: { allEvents: [newEvent] } };
    
    expect(rootReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle REMOVE_EVENT', () => {
    const initialState = {
      events: {
        allEvents: [
          { id: 1, title: 'Event to keep' },
          { id: 2, title: 'Event to remove' },
        ],
      },
    };
    const action = { type: types.REMOVE_EVENT, payload: 2 };
    const expectedState = {
      events: { allEvents: [{ id: 1, title: 'Event to keep' }] },
    };

    expect(rootReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_EVENT', () => {
    const initialState = {
      events: {
        allEvents: [
          { id: 1, title: 'Old Title' },
          { id: 2, title: 'Another Event' },
        ],
      },
    };
    const updatedEvent = { id: 1, title: 'New Updated Title' };
    const action = { type: types.UPDATE_EVENT, payload: { id: 1, obj: updatedEvent } };
    const expectedState = {
      events: {
        allEvents: [updatedEvent, { id: 2, title: 'Another Event' }],
      },
    };

    expect(rootReducer(initialState, action)).toEqual(expectedState);
  });

  it('should not change state for unknown action types', () => {
    const currentState = {
      events: { allEvents: [{ id: 1, title: 'Some Event' }] },
    };
    const action = { type: 'UNKNOWN_ACTION' };

    expect(rootReducer(currentState, action)).toEqual(currentState);
  });

});
