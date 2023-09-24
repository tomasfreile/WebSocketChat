import { createSlice} from '@reduxjs/toolkit';

const stompSlice = createSlice({
  name: 'stomp',
  initialState: {
    messages: [],

  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  }
});

export const { addMessage } = stompSlice.actions;
export const stompReducer = stompSlice.reducer;

// An action to start stomp connection.
export const connectStomp = () => ({ type: 'connect' });
// An action to disconnect stomp connection.
export const disconnectStomp = () => ({ type: 'disconnect' })

