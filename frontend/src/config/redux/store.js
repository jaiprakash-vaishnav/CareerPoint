import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/auth/index.js';
/*
*
* STEPS for State Management using Redux:
* Submit Action
* Handle Action in it's Reducer
* Register Here -> Reducer
*
*/

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});