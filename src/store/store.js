import { configureStore } from '@reduxjs/toolkit';
import { stompReducer } from './stomp/stomp-slice';
import { stompMiddleware } from './stomp/stomp-middleware';

export const store = configureStore({
  reducer: {
    stomp: stompReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stompMiddleware),
});
