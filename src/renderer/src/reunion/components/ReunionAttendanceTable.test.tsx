/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReunionAttendanceTable } from './ReunionAttendanceTable';
import { makeRecord } from './testUtils';


describe('ReunionAttendanceTable', () => {
  const defaultProps = {
    filteredRecords: [],
    isLoading: false,
    isClosed: false,
    drawerOpen: false,
    onViewRecord: vi.fn(),
    onDeleteRecord: vi.fn(),
    onToggleDelivery: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('deve renderizar a tabela base', () => {
    render(<ReunionAttendanceTable {...defaultProps} />);

    expect(screen.getByTestId('base-table')).toBeDefined();
  });

  it('deve passar isLoading corretamente para a BaseTable', () => {
    render(<ReunionAttendanceTable {...defaultProps} isLoading={true} />);

    const tables = screen.getAllByTestId('base-table');
    expect(tables[tables.length - 1].getAttribute('data-loading')).toBe('true');
  });

  it('deve passar drawerOpen corretamente para a BaseTable', () => {
    render(<ReunionAttendanceTable {...defaultProps} drawerOpen={true} />);

    const tables = screen.getAllByTestId('base-table');
    expect(tables[tables.length - 1].getAttribute('data-drawer-open')).toBe('true');
  });

  it('deve renderizar linhas para cada registro', () => {
    const records = [makeRecord({ id: 1 }), makeRecord({ id: 2 })];
    render(<ReunionAttendanceTable {...defaultProps} filteredRecords={records} />);

    expect(screen.getByTestId('row-1')).toBeDefined();
    expect(screen.getByTestId('row-2')).toBeDefined();
  });

  it('deve exibir o número do prontuário', () => {
    const records = [makeRecord({ prontuarioNumber: 99 })];
    render(<ReunionAttendanceTable {...defaultProps} filteredRecords={records} />);

    expect(screen.getByText('99')).toBeDefined();
  });

  it('deve exibir tag "A" quando ministerio=true', () => {
    const records = [makeRecord({ ministerio: true })];
    render(<ReunionAttendanceTable {...defaultProps} filteredRecords={records} />);

    expect(screen.getByTestId('tag')).toBeDefined();
    expect(screen.getByText('A')).toBeDefined();
  });

  it('não deve exibir tag "A" quando ministerio=false', () => {
    const records = [makeRecord({ ministerio: false })];
    render(<ReunionAttendanceTable {...defaultProps} filteredRecords={records} />);

    // Quando ministerio=false, nenhuma tag deve aparecer na linha renderizada
    expect(screen.queryByText('A')).toBeNull();
  });

  it('deve chamar onViewRecord ao clicar no ícone de visualização', () => {
    const onViewRecord = vi.fn();
    const record = makeRecord({ id: 1, prontuarioNumber: 42, valor: 100 });
    render(<ReunionAttendanceTable {...defaultProps} filteredRecords={[record]} onViewRecord={onViewRecord} />);

    fireEvent.click(screen.getAllByTestId('fi-eye')[0].closest('button')!);

    expect(onViewRecord).toHaveBeenCalledWith(record);
  });

  it('deve chamar onDeleteRecord ao clicar no ícone de exclusão', () => {
    const onDeleteRecord = vi.fn();
    const record = makeRecord({ id: 5, prontuarioNumber: 42, valor: 100 });
    render(<ReunionAttendanceTable {...defaultProps} filteredRecords={[record]} onDeleteRecord={onDeleteRecord} />);

    fireEvent.click(screen.getAllByTestId('fi-trash')[0].closest('button')!);

    expect(onDeleteRecord).toHaveBeenCalledWith(5);
  });

  it('deve exibir a coluna "Devolvido" com checkbox quando isClosed=true', () => {
    const records = [makeRecord({ id: 1, delivered: false })];
    render(<ReunionAttendanceTable {...defaultProps} filteredRecords={records} isClosed={true} />);

    expect(screen.getByTestId('checkbox')).toBeDefined();
  });

  it('não deve exibir a coluna "Devolvido" quando isClosed=false', () => {
    const records = [makeRecord({ id: 1 })];
    render(<ReunionAttendanceTable {...defaultProps} filteredRecords={records} isClosed={false} />);

    expect(screen.queryByTestId('checkbox')).toBeNull();
  });

  it('deve chamar onToggleDelivery ao clicar no checkbox de devolvido', () => {
    const onToggleDelivery = vi.fn();
    const record = makeRecord({ id: 3, delivered: false });
    render(
      <ReunionAttendanceTable
        {...defaultProps}
        filteredRecords={[record]}
        isClosed={true}
        onToggleDelivery={onToggleDelivery}
      />
    );

    fireEvent.click(screen.getByTestId('checkbox'));

    expect(onToggleDelivery).toHaveBeenCalledWith(3, false);
  });

  it('deve renderizar as labels do registro', () => {
    const records = [makeRecord({ id: 1, labels: ['Emergencial', 'Somente roupas'] })];
    render(<ReunionAttendanceTable {...defaultProps} filteredRecords={records} />);

    expect(screen.getByText('Emergencial')).toBeDefined();
    expect(screen.getByText('Somente roupas')).toBeDefined();
  });

  it('deve exibir "R$ 0" estilizado quando valor=0', () => {
    const records = [makeRecord({ id: 1, valor: 0 })];
    render(<ReunionAttendanceTable {...defaultProps} filteredRecords={records} />);

    expect(screen.getByText('R$ 0')).toBeDefined();
  });

  it('deve exibir o valor formatado quando valor > 0', () => {
    const records = [makeRecord({ id: 1, valor: 250 })];
    render(<ReunionAttendanceTable {...defaultProps} filteredRecords={records} />);

    expect(screen.getByText('R$ 250')).toBeDefined();
  });
});
