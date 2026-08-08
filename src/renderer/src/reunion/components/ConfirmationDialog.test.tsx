/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConfirmationDialog } from './ConfirmationDialog';


const defaultProps = {
  open: true,
  onClose: vi.fn(),
  title: 'Confirmar Ação',
  onConfirm: vi.fn(),
  confirmLabel: 'Confirmar',
};

describe('ConfirmationDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('deve renderizar o diálogo quando open=true', () => {
    render(
      <ConfirmationDialog {...defaultProps}>
        <p>Conteúdo do diálogo</p>
      </ConfirmationDialog>
    );

    expect(screen.getByTestId('dialog-root')).toBeDefined();
    expect(screen.getByTestId('dialog-title')).toBeDefined();
    expect(screen.getByText('Confirmar Ação')).toBeDefined();
  });

  it('não deve renderizar o diálogo quando open=false', () => {
    render(
      <ConfirmationDialog {...defaultProps} open={false}>
        <p>Conteúdo</p>
      </ConfirmationDialog>
    );

    expect(screen.queryByTestId('dialog-root')).toBeNull();
  });

  it('deve exibir o conteúdo filho (children)', () => {
    render(
      <ConfirmationDialog {...defaultProps}>
        <p data-testid="child-content">Texto filho</p>
      </ConfirmationDialog>
    );

    expect(screen.getByTestId('child-content')).toBeDefined();
    expect(screen.getByText('Texto filho')).toBeDefined();
  });

  it('deve chamar onConfirm e onClose ao clicar no botão de confirmação', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(
      <ConfirmationDialog {...defaultProps} onConfirm={onConfirm} onClose={onClose}>
        <p>Conteúdo</p>
      </ConfirmationDialog>
    );

    fireEvent.click(screen.getByText('Confirmar'));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao clicar em "Cancelar"', () => {
    const onClose = vi.fn();

    render(
      <ConfirmationDialog {...defaultProps} onClose={onClose}>
        <p>Conteúdo</p>
      </ConfirmationDialog>
    );

    fireEvent.click(screen.getByText('Cancelar'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve aplicar o confirmLabel correto no botão de confirmação', () => {
    render(
      <ConfirmationDialog {...defaultProps} confirmLabel="Encerrar Reunião">
        <p>Conteúdo</p>
      </ConfirmationDialog>
    );

    expect(screen.getByText('Encerrar Reunião')).toBeDefined();
  });

  it('deve usar "blue" como colorPalette padrão no botão de confirmação', () => {
    render(
      <ConfirmationDialog {...defaultProps}>
        <p>Conteúdo</p>
      </ConfirmationDialog>
    );

    const confirmButton = screen.getAllByText('Confirmar')[0];
    expect(confirmButton.getAttribute('data-color-palette')).toBe('blue');
  });

  it('deve aceitar confirmColorPalette customizado', () => {
    render(
      <ConfirmationDialog {...defaultProps} confirmColorPalette="red">
        <p>Conteúdo</p>
      </ConfirmationDialog>
    );

    const confirmButton = screen.getAllByText('Confirmar')[0];
    expect(confirmButton.getAttribute('data-color-palette')).toBe('red');
  });
});
