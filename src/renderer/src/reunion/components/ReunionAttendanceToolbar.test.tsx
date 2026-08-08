/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReunionAttendanceToolbar } from './ReunionAttendanceToolbar';


describe('ReunionAttendanceToolbar', () => {
  const defaultProps = {
    search: '',
    setSearch: vi.fn(),
    isClosed: false,
    onAddRecord: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('deve renderizar o campo de pesquisa', () => {
    render(<ReunionAttendanceToolbar {...defaultProps} />);

    expect(screen.getByTestId('search-input')).toBeDefined();
  });

  it('deve exibir o valor atual no campo de pesquisa', () => {
    render(<ReunionAttendanceToolbar {...defaultProps} search="prontuario 42" />);

    const input = screen.getByTestId('search-input') as HTMLInputElement;
    expect(input.value).toBe('prontuario 42');
  });

  it('deve chamar setSearch ao digitar no campo de pesquisa', () => {
    const setSearch = vi.fn();
    render(<ReunionAttendanceToolbar {...defaultProps} setSearch={setSearch} />);

    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'novo valor' } });

    expect(setSearch).toHaveBeenCalledWith('novo valor');
  });

  it('deve exibir o botão "Adicionar" quando isClosed=false', () => {
    render(<ReunionAttendanceToolbar {...defaultProps} isClosed={false} />);

    expect(screen.getByText(/adicionar/i)).toBeDefined();
  });

  it('não deve exibir o botão "Adicionar" quando isClosed=true', () => {
    render(<ReunionAttendanceToolbar {...defaultProps} isClosed={true} />);

    expect(screen.queryByText(/adicionar/i)).toBeNull();
  });

  it('deve chamar onAddRecord ao clicar em "Adicionar"', () => {
    const onAddRecord = vi.fn();
    render(<ReunionAttendanceToolbar {...defaultProps} isClosed={false} onAddRecord={onAddRecord} />);

    fireEvent.click(screen.getByText(/adicionar/i));

    expect(onAddRecord).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar o botão de filtros', () => {
    render(<ReunionAttendanceToolbar {...defaultProps} />);

    expect(screen.getByText(/filtros/i)).toBeDefined();
  });
});
