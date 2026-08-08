/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReunionForm } from './useReunionForm';
import { TestWrapper } from '../../utils/TestWrapper';

// Mock dependencies
vi.mock('../../hooks/records/useRecords', () => ({
  useRecords: vi.fn(() => ({
    createAtendimento: { mutateAsync: vi.fn() },
    updateAtendimento: { mutateAsync: vi.fn() },
    reunions: { data: { date: '2023-10-15' } },
  })),
}));

vi.mock('../../hooks/prontuario', () => ({
  useProntuarios: vi.fn(() => ({
    activeProntuarios: [
      { id: 1, number: 100, ministry: true, unityId: 2 },
    ],
    createProntuario: { mutateAsync: vi.fn() },
  })),
}));

vi.mock('../services/ReunionActionService', () => ({
  ReunionActionService: {
    isValidProntuarioNumber: vi.fn((val) => Number(val) > 0),
    formatSavePayload: vi.fn(() => ({})),
  },
}));

describe('useReunionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default form state', () => {
    const { result } = renderHook(() => useReunionForm(1), { wrapper: TestWrapper });

    expect(result.current.drawerOpen).toBe(false);
    expect(result.current.formState.prontuarioSearch).toBe('');
    expect(result.current.formState.record.id).toBe(0);
  });

  it('should handle setting drawer open state', () => {
    const { result } = renderHook(() => useReunionForm(1), { wrapper: TestWrapper });

    act(() => {
      result.current.setDrawerOpen(true);
    });

    expect(result.current.drawerOpen).toBe(true);
  });

  it('should update record data', () => {
    const { result } = renderHook(() => useReunionForm(1), { wrapper: TestWrapper });

    act(() => {
      result.current.updateRecord({ valor: 50 });
    });

    expect(result.current.formState.record.valor).toBe(50);
  });

  it('should handle prontuario selection', () => {
    const { result } = renderHook(() => useReunionForm(1), { wrapper: TestWrapper });

    act(() => {
      result.current.setDrawerOpen(true);
    });

    act(() => {
      result.current.handleProntuarioSelect('1'); // ID of mocked activeProntuario
    });

    expect(result.current.formState.record.prontuarioId).toBe(1);
    expect(result.current.formState.record.prontuarioNumber).toBe(100);
    expect(result.current.formState.selectedUnityId).toBe(2);
  });
});
