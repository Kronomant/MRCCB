/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReunionTable } from './useReunionTable';
import { TestWrapper } from '../../utils/TestWrapper';

// Mock dependencies
vi.mock('../../hooks/records/useRecords', () => ({
  useRecords: vi.fn(() => ({
    records: [
      { id: 1, prontuarioNumber: 100, valor: 50 },
      { id: 2, prontuarioNumber: 200, valor: 100 },
    ],
    deleteAtendimento: { mutate: vi.fn() },
    toggleDelivery: { mutateAsync: vi.fn() },
  })),
}));

describe('useReunionTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty search and filtered records matching all records', () => {
    const { result } = renderHook(() => useReunionTable(1), { wrapper: TestWrapper });

    expect(result.current.search).toBe('');
    expect(result.current.filteredRecords).toHaveLength(2);
  });

  it('should filter records based on search string', () => {
    const { result } = renderHook(() => useReunionTable(1), { wrapper: TestWrapper });

    act(() => {
      result.current.setSearch('200');
    });

    expect(result.current.search).toBe('200');
    expect(result.current.filteredRecords).toHaveLength(1);
    expect(result.current.filteredRecords[0].id).toBe(2);
  });

  it('should return handleDelete and handleToggleDelivery handlers', () => {
    const { result } = renderHook(() => useReunionTable(1), { wrapper: TestWrapper });

    expect(typeof result.current.handleDelete).toBe('function');
    expect(typeof result.current.handleToggleDelivery).toBe('function');
  });
});
