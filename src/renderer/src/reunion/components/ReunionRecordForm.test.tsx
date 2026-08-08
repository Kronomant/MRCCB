/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReunionRecordForm } from './ReunionRecordForm';
import { makeRecord } from './testUtils';


const defaultProps = {
  record: makeRecord(),
  prontuarioSearch: '',
  isNewProntuario: false,
  selectedUnityId: null,
  filteredProntuarios: [],
  collection: { items: [] } as any,
  unities: [] as Unity[],
  onRecordChange: vi.fn(),
  onProntuarioSelect: vi.fn(),
  onProntuarioSearch: vi.fn(),
  onUnityChange: vi.fn(),
};

describe('ReunionRecordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('deve renderizar o combobox de prontuário', () => {
    render(<ReunionRecordForm {...defaultProps} />);

    expect(screen.getByTestId('combobox-root')).toBeDefined();
    expect(screen.getByText('Prontuário')).toBeDefined();
  });

  it('deve renderizar o select de unidade', () => {
    render(<ReunionRecordForm {...defaultProps} />);

    expect(screen.getByTestId('select-root')).toBeDefined();
    expect(screen.getByText('Unidade')).toBeDefined();
  });

  it('deve renderizar o campo de valor monetário', () => {
    render(<ReunionRecordForm {...defaultProps} />);

    expect(screen.getByTestId('currency-input')).toBeDefined();
  });

  it('deve renderizar o campo de quantidade de cestas', () => {
    render(<ReunionRecordForm {...defaultProps} />);

    expect(screen.getByTestId('number-input')).toBeDefined();
  });

  it('deve exibir o checkbox de Ministério', () => {
    render(<ReunionRecordForm {...defaultProps} />);

    expect(screen.getByText('Ministério')).toBeDefined();
  });

  it('deve exibir checkboxes para cada label em REUNION_LABEL_COLORS', () => {
    render(<ReunionRecordForm {...defaultProps} />);

    expect(screen.getByText('Emergencial')).toBeDefined();
    expect(screen.getByText('Somente roupas')).toBeDefined();
  });

  it('deve chamar onRecordChange ao alterar o valor monetário', () => {
    const onRecordChange = vi.fn();
    render(<ReunionRecordForm {...defaultProps} onRecordChange={onRecordChange} />);

    fireEvent.change(screen.getByTestId('currency-input'), { target: { value: '150' } });

    expect(onRecordChange).toHaveBeenCalledWith({ valor: 150 });
  });

  it('deve chamar onRecordChange ao alterar o número de cestas', () => {
    const onRecordChange = vi.fn();
    render(<ReunionRecordForm {...defaultProps} onRecordChange={onRecordChange} />);

    fireEvent.change(screen.getByTestId('number-input'), { target: { value: '3' } });

    expect(onRecordChange).toHaveBeenCalledWith({ cestas: 3 });
  });

  it('deve marcar o checkbox "Ministério" conforme record.ministerio', () => {
    render(<ReunionRecordForm {...defaultProps} record={makeRecord({ ministerio: true })} />);

    // Obter todos os checkboxes e verificar o primeiro (Ministério)
    const checkboxes = screen.getAllByTestId('checkbox');
    // O checkbox de ministério é o primeiro
    expect(checkboxes[0].getAttribute('data-checked')).toBe('true');
  });

  it('deve chamar onRecordChange ao marcar/desmarcar Ministério', () => {
    const onRecordChange = vi.fn();
    render(
      <ReunionRecordForm
        {...defaultProps}
        record={makeRecord({ ministerio: false })}
        onRecordChange={onRecordChange}
      />
    );

    const checkboxes = screen.getAllByTestId('checkbox');
    fireEvent.click(checkboxes[0]); // clica no checkbox de Ministério

    expect(onRecordChange).toHaveBeenCalledWith({ ministerio: true });
  });

  it('deve exibir os itens do combobox de prontuários filtrados', () => {
    const filteredProntuarios = [
      { label: 'Prontuário 001', value: '1' },
      { label: 'Prontuário 002', value: '2' },
    ];

    render(
      <ReunionRecordForm
        {...defaultProps}
        filteredProntuarios={filteredProntuarios}
      />
    );

    expect(screen.getByText('Prontuário 001')).toBeDefined();
    expect(screen.getByText('Prontuário 002')).toBeDefined();
  });

  it('deve exibir prefixo "+ Criar" para itens novos no combobox', () => {
    const filteredProntuarios = [
      { label: '999', value: 'new-999' },
    ];

    render(
      <ReunionRecordForm
        {...defaultProps}
        filteredProntuarios={filteredProntuarios}
      />
    );

    expect(screen.getByText('+ Criar "999"')).toBeDefined();
  });

  it('deve adicionar label ao clicar em checkbox de label não selecionada', () => {
    const onRecordChange = vi.fn();
    render(
      <ReunionRecordForm
        {...defaultProps}
        record={makeRecord({ labels: [] })}
        onRecordChange={onRecordChange}
      />
    );

    // Checkboxes: [0]=Ministério, [1]=Emergencial, [2]=Somente roupas
    const checkboxes = screen.getAllByTestId('checkbox');
    fireEvent.click(checkboxes[1]); // Emergencial

    expect(onRecordChange).toHaveBeenCalledWith({ labels: ['Emergencial'] });
  });

  it('deve remover label ao clicar em checkbox de label já selecionada', () => {
    const onRecordChange = vi.fn();
    render(
      <ReunionRecordForm
        {...defaultProps}
        record={makeRecord({ labels: ['Emergencial'] })}
        onRecordChange={onRecordChange}
      />
    );

    const checkboxes = screen.getAllByTestId('checkbox');
    fireEvent.click(checkboxes[1]); // Emergencial (já selecionada -> remove)

    expect(onRecordChange).toHaveBeenCalledWith({ labels: [] });
  });

  it('deve exibir o inputValue atual no combobox', () => {
    render(<ReunionRecordForm {...defaultProps} prontuarioSearch="123" />);

    expect(screen.getByTestId('combobox-root').getAttribute('data-input-value')).toBe('123');
  });
});
