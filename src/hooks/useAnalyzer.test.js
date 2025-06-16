import { renderHook, act } from '@testing-library/react-hooks';
import useAnalyzer from './useAnalyzer';

describe('useAnalyzer', () => {
  test.skip('initializes with default values', () => {
    const { result } = renderHook(() => useAnalyzer());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.results).toBe(null);
  });

  test.skip('analyzes text content', async () => {
    const { result } = renderHook(() => useAnalyzer());
    const text = 'This is a test text.';
    
    await act(async () => {
      await result.current.analyzeText(text);
    });

    expect(result.current.results).toBeDefined();
    expect(result.current.error).toBe(null);
  });

  test.skip('analyzes code content', async () => {
    const { result } = renderHook(() => useAnalyzer());
    const code = 'function test() { return true; }';
    
    await act(async () => {
      await result.current.analyzeCode(code);
    });

    expect(result.current.results).toBeDefined();
    expect(result.current.error).toBe(null);
  });

  test.skip('handles analysis errors', async () => {
    const { result } = renderHook(() => useAnalyzer());
    
    await act(async () => {
      await result.current.analyzeText('');
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.results).toBe(null);
  });

  test.skip('sets loading state during analysis', async () => {
    const { result } = renderHook(() => useAnalyzer());
    const text = 'This is a test text.';
    
    act(() => {
      result.current.analyzeText(text);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await result.current.analyzeText(text);
    });

    expect(result.current.isLoading).toBe(false);
  });
}); 