/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReunionHeader } from './ReunionHeader';


const defaultProps = {
  dateString: '2024-01-15',
  isClosed: false,
  onNavigateBack: vi.fn(),
  onOpenCloseModal: vi.fn(),
  onOpenReopenModal: vi.fn(),
  onOpenProtocolModal: vi.fn(),
  onOpenValuesProtocolModal: vi.fn(),
};

describe('ReunionHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('deve renderizar o título "Reunião"', () => {
    render(<ReunionHeader {...defaultProps} />);

    expect(screen.getByText('Reunião')).toBeDefined();
  });

  it('deve chamar onNavigateBack ao clicar no botão de voltar', () => {
    const onNavigateBack = vi.fn();
    render(<ReunionHeader {...defaultProps} onNavigateBack={onNavigateBack} />);

    fireEvent.click(screen.getByTestId('back-button'));

    expect(onNavigateBack).toHaveBeenCalledTimes(1);
  });

  it('deve exibir o botão "Encerrar Reunião" quando isClosed=false', () => {
    render(<ReunionHeader {...defaultProps} isClosed={false} />);

    expect(screen.getByText(/encerrar reunião/i)).toBeDefined();
  });

  it('não deve exibir o botão "Encerrar Reunião" quando isClosed=true', () => {
    render(<ReunionHeader {...defaultProps} isClosed={true} />);

    expect(screen.queryByText(/encerrar reunião/i)).toBeNull();
  });

  it('deve exibir botões de reunião encerrada quando isClosed=true', () => {
    render(<ReunionHeader {...defaultProps} isClosed={true} />);

    expect(screen.getByText(/reabrir reunião/i)).toBeDefined();
    expect(screen.getByText(/gerar protocolo/i)).toBeDefined();
    expect(screen.getByText(/resultado da reunião/i)).toBeDefined();
  });

  it('não deve exibir botões de reunião encerrada quando isClosed=false', () => {
    render(<ReunionHeader {...defaultProps} isClosed={false} />);

    expect(screen.queryByText(/reabrir reunião/i)).toBeNull();
    expect(screen.queryByText(/gerar protocolo/i)).toBeNull();
  });

  it('deve chamar onOpenCloseModal ao clicar em "Encerrar Reunião"', () => {
    const onOpenCloseModal = vi.fn();
    render(<ReunionHeader {...defaultProps} isClosed={false} onOpenCloseModal={onOpenCloseModal} />);

    fireEvent.click(screen.getByText(/encerrar reunião/i));

    expect(onOpenCloseModal).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onOpenReopenModal ao clicar em "Reabrir Reunião"', () => {
    const onOpenReopenModal = vi.fn();
    render(<ReunionHeader {...defaultProps} isClosed={true} onOpenReopenModal={onOpenReopenModal} />);

    fireEvent.click(screen.getByText(/reabrir reunião/i));

    expect(onOpenReopenModal).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onOpenProtocolModal ao clicar em "Gerar Protocolo"', () => {
    const onOpenProtocolModal = vi.fn();
    render(<ReunionHeader {...defaultProps} isClosed={true} onOpenProtocolModal={onOpenProtocolModal} />);

    fireEvent.click(screen.getByText(/gerar protocolo/i));

    expect(onOpenProtocolModal).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onOpenValuesProtocolModal ao clicar em "Resultado da reunião"', () => {
    const onOpenValuesProtocolModal = vi.fn();
    render(
      <ReunionHeader {...defaultProps} isClosed={true} onOpenValuesProtocolModal={onOpenValuesProtocolModal} />
    );

    fireEvent.click(screen.getByText(/resultado da reunião/i));

    expect(onOpenValuesProtocolModal).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar sem erros quando dateString for undefined', () => {
    render(<ReunionHeader {...defaultProps} dateString={undefined} />);

    expect(screen.getByText('Reunião')).toBeDefined();
  });
});
