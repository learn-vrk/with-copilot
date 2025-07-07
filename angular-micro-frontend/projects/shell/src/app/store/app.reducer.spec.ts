import { appReducer, initialState } from './app.reducer';
import * as AppActions from './app.actions';

describe('App Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = appReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('loadMessage action', () => {
    it('should set loading to true and clear error', () => {
      const action = AppActions.loadMessage();
      const result = appReducer(initialState, action);
      
      expect(result.loading).toBe(true);
      expect(result.error).toBe(null);
    });
  });

  describe('loadMessageSuccess action', () => {
    it('should set message, loading to false, and clear error', () => {
      const message = 'Test message';
      const action = AppActions.loadMessageSuccess({ message });
      const previousState = {
        ...initialState,
        loading: true
      };
      
      const result = appReducer(previousState, action);
      
      expect(result.message).toBe(message);
      expect(result.loading).toBe(false);
      expect(result.error).toBe(null);
    });
  });

  describe('loadMessageFailure action', () => {
    it('should set error, loading to false, and clear message', () => {
      const error = 'Test error';
      const action = AppActions.loadMessageFailure({ error });
      const previousState = {
        ...initialState,
        loading: true,
        message: 'Previous message'
      };
      
      const result = appReducer(previousState, action);
      
      expect(result.error).toBe(error);
      expect(result.loading).toBe(false);
      expect(result.message).toBe('');
    });
  });

  describe('updateMessage action', () => {
    it('should update message and clear error', () => {
      const message = 'Updated message';
      const action = AppActions.updateMessage({ message });
      const previousState = {
        ...initialState,
        error: 'Previous error'
      };
      
      const result = appReducer(previousState, action);
      
      expect(result.message).toBe(message);
      expect(result.error).toBe(null);
    });
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      expect(initialState.message).toBe('');
      expect(initialState.loading).toBe(false);
      expect(initialState.error).toBe(null);
    });
  });
});
