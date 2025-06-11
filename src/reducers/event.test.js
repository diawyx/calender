import * as types from '../store/eventActionTypes';

// State awal untuk seluruh aplikasi
const initialState = {
  events: {
    allEvents: []
  }
};

// Reducer utama (rootReducer)
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          allEvents: [...state.events.allEvents, action.payload]
        }
      };

    case types.REMOVE_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          allEvents: state.events.allEvents.filter(event => event.id !== action.payload)
        }
      };

    case types.UPDATE_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          allEvents: state.events.allEvents.map(event =>
            event.id === action.payload.id ? action.payload.obj : event
          )
        }
      };

    default:
      return state;
  }
};

export default rootReducer;
