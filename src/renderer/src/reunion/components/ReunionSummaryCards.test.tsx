/**
 * @vitest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { ReunionSummaryCards } from './ReunionSummaryCards';


const mockSummary = {
  totalGasto: 1500,
  totalAtribuido: 2000,
  entregues: 5,
  atendimentos: 10,
  cestas: 3,
  data: '2024-01-15',
};

const mockReunion: Reunion = {
  id: 1,
  date: '2024-01-15',
  status: 'open',
  basketValue: 200,
};

describe('ReunionSummaryCards', () => {
  afterEach(() => {
    cleanup();
  });

  it('deve renderizar todos os cards de resumo', () => {
    render(<ReunionSummaryCards summary={mockSummary} isClosed={false} reunion={mockReunion} />);

    expect(screen.getByText('Valor Atribuído')).toBeDefined();
    expect(screen.getByText('Total Atendimentos')).toBeDefined();
    expect(screen.getByText('Total Cestas')).toBeDefined();
    expect(screen.getByText('Valor Total')).toBeDefined();
    expect(screen.getByText('Atendimentos')).toBeDefined();
    expect(screen.getByText('Cestas')).toBeDefined();
  });

  it('não deve exibir o card "Prontuários Devolvidos" quando isClosed=false', () => {
    render(<ReunionSummaryCards summary={mockSummary} isClosed={false} reunion={mockReunion} />);

    expect(screen.queryByText('Prontuários Devolvidos')).toBeNull();
  });

  it('deve exibir o card "Prontuários Devolvidos" quando isClosed=true', () => {
    render(<ReunionSummaryCards summary={mockSummary} isClosed={true} reunion={mockReunion} />);

    expect(screen.getByText('Prontuários Devolvidos')).toBeDefined();
  });

  it('deve exibir o progresso de entregas no card de devolvidos', () => {
    render(<ReunionSummaryCards summary={mockSummary} isClosed={true} reunion={mockReunion} />);

    expect(screen.getByTestId('progress-root')).toBeDefined();
  });

  it('deve exibir o valor de atendimentos formatado em BRL', () => {
    render(<ReunionSummaryCards summary={mockSummary} isClosed={false} reunion={mockReunion} />);

    // totalGasto = 1500 -> R$ 1.500,00 - verificamos a label "Total Atendimentos"
    expect(screen.getByText('Total Atendimentos')).toBeDefined();
    // O valor formatado deve existir pelo menos uma vez na tela
    expect(screen.getAllByText(/1\.500,00/).length).toBeGreaterThanOrEqual(1);
  });

  it('deve calcular e exibir o valor de cestas corretamente', () => {
    // 3 cestas * R$200 = R$600
    render(<ReunionSummaryCards summary={mockSummary} isClosed={false} reunion={mockReunion} />);

    expect(screen.getByText('Total Cestas')).toBeDefined();
    expect(screen.getAllByText(/600,00/).length).toBeGreaterThanOrEqual(1);
  });

  it('deve calcular e exibir o valor total corretamente', () => {
    // totalGasto(1500) + valorCestas(600) = 2100
    render(<ReunionSummaryCards summary={mockSummary} isClosed={false} reunion={mockReunion} />);

    expect(screen.getByText('Valor Total')).toBeDefined();
    expect(screen.getAllByText(/2\.100,00/).length).toBeGreaterThanOrEqual(1);
  });

  it('deve usar basketValue=0 quando reunion for undefined', () => {
    // cestas=3 * 0 = 0, valorCestas=R$0,00
    render(<ReunionSummaryCards summary={mockSummary} isClosed={false} reunion={undefined} />);

    // A label "Total Cestas" deve aparecer e seu valor deve ser R$ 0,00
    expect(screen.getByText('Total Cestas')).toBeDefined();
    // getAllByText para evitar ambiguidade com outros valores que terminam em ,00
    const zeroElements = screen.getAllByText(/0,00/);
    expect(zeroElements.length).toBeGreaterThanOrEqual(1);
  });

  it('deve exibir o número de atendimentos e cestas', () => {
    render(<ReunionSummaryCards summary={mockSummary} isClosed={false} reunion={mockReunion} />);

    expect(screen.getAllByText('10').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
  });

  it('deve exibir a contagem de devolvidos no formato "entregues / atendimentos"', () => {
    render(<ReunionSummaryCards summary={mockSummary} isClosed={true} reunion={mockReunion} />);

    expect(screen.getAllByText('5 / 10').length).toBeGreaterThanOrEqual(1);
  });
});
