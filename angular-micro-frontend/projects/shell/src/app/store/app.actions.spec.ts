import * as AppActions from './app.actions';

describe('App Actions', () => {
  describe('loadMessage', () => {
    it('should create loadMessage action', () => {
      const action = AppActions.loadMessage();
      expect(action).toEqual({
        type: '[App] Load Message'
      });
    });
  });

  describe('loadMessageSuccess', () => {
    it('should create loadMessageSuccess action with message', () => {
      const message = 'Test message';
      const action = AppActions.loadMessageSuccess({ message });
      expect(action).toEqual({
        type: '[App] Load Message Success',
        message
      });
    });
  });

  describe('loadMessageFailure', () => {
    it('should create loadMessageFailure action with error', () => {
      const error = 'Test error';
      const action = AppActions.loadMessageFailure({ error });
      expect(action).toEqual({
        type: '[App] Load Message Failure',
        error
      });
    });
  });

  describe('updateMessage', () => {
    it('should create updateMessage action with message', () => {
      const message = 'Updated message';
      const action = AppActions.updateMessage({ message });
      expect(action).toEqual({
        type: '[App] Update Message',
        message
      });
    });
  });
});
