/**
 * @vitest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReunionModalsContainer } from './ReunionModalsContainer';
import { makeRecord } from './testUtils';


// Mock ConfirmationDialog (específico deste teste)
vi.mock('./ConfirmationDialog', () => ({
  ConfirmationDialog: ({ children, open, title, confirmLabel, confirmColorPalette, onClose, onConfirm }: any) =>
    open ? (
      <div data-testid="confirmation-dialog" data-title={title} data-color={confirmColorPalette}>
        <span data-testid="dialog-title-text">{title}</span>
        <button data-testid={`confirm-btn-${title}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button data-testid={`close-btn-${title}`} onClick={onClose}>
          Fechar
        </button>
        {children}
      </div>
    ) : null,
}));

// Mock ReunionCloseDialogBody (específico deste teste)
vi.mock('./ReunionCloseDialogBody', () => ({
  ReunionCloseDialogBody: ({ summary, reunion }: any) => (
    <div data-testid="close-dialog-body" data-atendimentos={summary.atendimentos} />
  ),
}));

// Mock ProtocolModal (específico deste teste)
vi.mock('../../components/ProtocolPDF/ProtocolModal', () => ({
  ProtocolModal: ({ isOpen }: any) =>
    isOpen ? <div data-testid="protocol-modal" /> : null,
}));

// Mock ValuesProtocolModal (específico deste teste)
vi.mock('../../components', () => ({
  ValuesProtocolModal: ({ isOpen }: any) =>
    isOpen ? <div data-testid="values-protocol-modal" /> : null,
}));

const defaultProps = {
  reopenModalOpen: false,
  setReopenModalOpen: vi.fn(),
  closeModalOpen: false,
  setCloseModalOpen: vi.fn(),
  protocolModalOpen: false,
  setProtocolModalOpen: vi.fn(),
  valuesProtocolModalOpen: false,
  setValuesProtocolModalOpen: vi.fn(),
  onConfirmReopen: vi.fn(),
  onConfirmClose: vi.fn(),
  summary: { totalGasto: 0, cestas: 0, atendimentos: 0, data: '2024-01-15' },
  reunion: { id: 1, date: '2024-01-15', status: 'open', basketValue: 100 } as Reunion,
  records: [makeRecord({ id: 1, prontuarioId: 1, prontuarioNumber: 100, valor: 200, cestas: 1 })],
  unities: [] as Unity[],
  prontuarios: [] as Prontuario[],
};

describe('ReunionModalsContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('não deve exibir nenhum modal por padrão', () => {
    render(<ReunionModalsContainer {...defaultProps} />);

    expect(screen.queryByTestId('confirmation-dialog')).toBeNull();
    expect(screen.queryByTestId('protocol-modal')).toBeNull();
    expect(screen.queryByTestId('values-protocol-modal')).toBeNull();
  });

  it('deve exibir o modal de reabertura quando reopenModalOpen=true', () => {
    render(<ReunionModalsContainer {...defaultProps} reopenModalOpen={true} />);

    const dialog = screen.getByTestId('dialog-title-text');
    expect(dialog.textContent).toBe('Confirmar Reabertura');
  });

  it('deve exibir o modal de encerramento quando closeModalOpen=true', () => {
    render(<ReunionModalsContainer {...defaultProps} closeModalOpen={true} />);

    const dialog = screen.getByTestId('dialog-title-text');
    expect(dialog.textContent).toBe('Confirmar Encerramento');
  });

  it('deve exibir o ReunionCloseDialogBody dentro do modal de encerramento', () => {
    render(
      <ReunionModalsContainer
        {...defaultProps}
        closeModalOpen={true}
        summary={{ ...defaultProps.summary, atendimentos: 7 }}
      />
    );

    const body = screen.getByTestId('close-dialog-body');
    expect(body.getAttribute('data-atendimentos')).toBe('7');
  });

  it('deve exibir o ProtocolModal quando protocolModalOpen=true', () => {
    render(<ReunionModalsContainer {...defaultProps} protocolModalOpen={true} />);

    expect(screen.getByTestId('protocol-modal')).toBeDefined();
  });

  it('deve exibir o ValuesProtocolModal quando valuesProtocolModalOpen=true', () => {
    render(<ReunionModalsContainer {...defaultProps} valuesProtocolModalOpen={true} />);

    expect(screen.getByTestId('values-protocol-modal')).toBeDefined();
  });

  it('deve fechar o modal de reabertura ao chamar setReopenModalOpen(false)', () => {
    const setReopenModalOpen = vi.fn();
    render(
      <ReunionModalsContainer
        {...defaultProps}
        reopenModalOpen={true}
        setReopenModalOpen={setReopenModalOpen}
      />
    );

    screen.getByTestId('close-btn-Confirmar Reabertura').click();

    expect(setReopenModalOpen).toHaveBeenCalledWith(false);
  });

  it('deve chamar onConfirmReopen ao confirmar reabertura', () => {
    const onConfirmReopen = vi.fn();
    render(
      <ReunionModalsContainer
        {...defaultProps}
        reopenModalOpen={true}
        onConfirmReopen={onConfirmReopen}
      />
    );

    screen.getByTestId('confirm-btn-Confirmar Reabertura').click();

    expect(onConfirmReopen).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onConfirmClose ao confirmar encerramento', () => {
    const onConfirmClose = vi.fn();
    render(
      <ReunionModalsContainer
        {...defaultProps}
        closeModalOpen={true}
        onConfirmClose={onConfirmClose}
      />
    );

    screen.getByTestId('confirm-btn-Confirmar Encerramento').click();

    expect(onConfirmClose).toHaveBeenCalledTimes(1);
  });

  it('deve fechar o modal de encerramento ao chamar setCloseModalOpen(false)', () => {
    const setCloseModalOpen = vi.fn();
    render(
      <ReunionModalsContainer
        {...defaultProps}
        closeModalOpen={true}
        setCloseModalOpen={setCloseModalOpen}
      />
    );

    screen.getByTestId('close-btn-Confirmar Encerramento').click();

    expect(setCloseModalOpen).toHaveBeenCalledWith(false);
  });
});
