/**
 * @vitest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { ReunionCloseDialogBody } from './ReunionCloseDialogBody';


const mockSummary = {
  totalGasto: 500,
  cestas: 3,
  atendimentos: 10,
};

const mockReunion: Reunion = {
  id: 1,
  date: '2024-01-15',
  status: 'open',
  basketValue: 100,
};

describe('ReunionCloseDialogBody', () => {
  afterEach(() => {
    cleanup();
  });

  it('deve renderizar a mensagem de aviso de encerramento', () => {
    render(<ReunionCloseDialogBody summary={mockSummary} reunion={mockReunion} />);

    expect(screen.getByText(/prestes a encerrar/i)).toBeDefined();
  });

  it('deve calcular e exibir o valor total corretamente (atendimentos + cestas)', () => {
    // totalGasto=500, cestas=3, basketValue=100 => basketTotal=300, grandTotal=800
    render(<ReunionCloseDialogBody summary={mockSummary} reunion={mockReunion} />);

    expect(screen.getByText('R$ 800,00')).toBeDefined();
  });

  it('deve exibir o valor de atendimentos separado', () => {
    render(<ReunionCloseDialogBody summary={mockSummary} reunion={mockReunion} />);

    expect(screen.getByText('R$ 500,00')).toBeDefined();
  });

  it('deve exibir o valor de cestas separado', () => {
    // 3 cestas * R$100 = R$300
    render(<ReunionCloseDialogBody summary={mockSummary} reunion={mockReunion} />);

    expect(screen.getByText('R$ 300,00')).toBeDefined();
  });

  it('deve exibir o número de cestas', () => {
    render(<ReunionCloseDialogBody summary={mockSummary} reunion={mockReunion} />);

    expect(screen.getByText('3')).toBeDefined();
  });

  it('deve exibir o número de atendimentos', () => {
    render(<ReunionCloseDialogBody summary={mockSummary} reunion={mockReunion} />);

    expect(screen.getByText('10')).toBeDefined();
  });

  it('deve usar basketValue=0 quando reunion for undefined', () => {
    // basketTotal = 0, grandTotal = totalGasto
    render(<ReunionCloseDialogBody summary={mockSummary} reunion={undefined} />);

    // grandTotal = 500, basketTotal = 0
    const elements = screen.getAllByText('R$ 500,00');
    // Both total and atendimento value should be 500
    expect(elements.length).toBeGreaterThanOrEqual(2);
  });

  it('deve exibir a mensagem sobre status "Encerrado" após confirmar', () => {
    render(<ReunionCloseDialogBody summary={mockSummary} reunion={mockReunion} />);

    expect(screen.getByText(/status.*encerrado/i)).toBeDefined();
  });
});
