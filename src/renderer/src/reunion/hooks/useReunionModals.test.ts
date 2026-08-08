/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useReunionModals } from './useReunionModals';

describe('useReunionModals', () => {
  it('should initialize all modal states to false', () => {
    const { result } = renderHook(() => useReunionModals());
    
    expect(result.current.closeModalOpen).toBe(false);
    expect(result.current.reopenModalOpen).toBe(false);
    expect(result.current.protocolModalOpen).toBe(false);
    expect(result.current.valuesProtocolModalOpen).toBe(false);
  });

  it('should correctly toggle closeModalOpen', () => {
    const { result } = renderHook(() => useReunionModals());
    
    act(() => {
      result.current.setCloseModalOpen(true);
    });
    
    expect(result.current.closeModalOpen).toBe(true);
  });

  it('should correctly toggle reopenModalOpen', () => {
    const { result } = renderHook(() => useReunionModals());
    
    act(() => {
      result.current.setReopenModalOpen(true);
    });
    
    expect(result.current.reopenModalOpen).toBe(true);
  });

  it('should correctly toggle protocolModalOpen', () => {
    const { result } = renderHook(() => useReunionModals());
    
    act(() => {
      result.current.setProtocolModalOpen(true);
    });
    
    expect(result.current.protocolModalOpen).toBe(true);
  });

  it('should correctly toggle valuesProtocolModalOpen', () => {
    const { result } = renderHook(() => useReunionModals());
    
    act(() => {
      result.current.setValuesProtocolModalOpen(true);
    });
    
    expect(result.current.valuesProtocolModalOpen).toBe(true);
  });
});
