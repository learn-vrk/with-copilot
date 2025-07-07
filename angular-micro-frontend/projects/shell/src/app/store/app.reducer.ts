import { createReducer, on } from '@ngrx/store';
import * as AppActions from './app.actions';

export interface AppState {
  message: string;
  loading: boolean;
  error: string | null;
}

export const initialState: AppState = {
  message: 'Hello, World!',
  loading: false,
  error: null
};

export const appReducer = createReducer(
  initialState,
  on(AppActions.updateMessage, (state, { message }) => ({
    ...state,
    message
  })),
  on(AppActions.loadMessage, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AppActions.loadMessageSuccess, (state, { message }) => ({
    ...state,
    message,
    loading: false,
    error: null
  })),
  on(AppActions.loadMessageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
