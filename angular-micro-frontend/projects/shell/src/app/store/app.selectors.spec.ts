import { selectMessage, selectLoading, selectError } from './app.selectors';
import { AppState } from './app.reducer';

describe('App Selectors', () => {
  const mockState: { app: AppState } = {
    app: {
      message: 'Test message',
      loading: true,
      error: 'Test error'
    }
  };

  describe('selectMessage', () => {
    it('should select message from state', () => {
      const result = selectMessage(mockState);
      expect(result).toBe('Test message');
    });
  });

  describe('selectLoading', () => {
    it('should select loading from state', () => {
      const result = selectLoading(mockState);
      expect(result).toBe(true);
    });
  });

  describe('selectError', () => {
    it('should select error from state', () => {
      const result = selectError(mockState);
      expect(result).toBe('Test error');
    });
  });

  describe('with empty state', () => {
    const emptyState: { app: AppState } = {
      app: {
        message: '',
        loading: false,
        error: null
      }
    };

    it('should select empty message', () => {
      const result = selectMessage(emptyState);
      expect(result).toBe('');
    });

    it('should select false loading', () => {
      const result = selectLoading(emptyState);
      expect(result).toBe(false);
    });

    it('should select null error', () => {
      const result = selectError(emptyState);
      expect(result).toBe(null);
    });
  });
});
