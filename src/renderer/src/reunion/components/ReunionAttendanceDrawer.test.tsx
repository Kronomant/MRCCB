/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReunionAttendanceDrawer } from './ReunionAttendanceDrawer';
import { makeRecord } from './testUtils';


// Mock ReunionRecordForm (específico deste teste)
vi.mock('./ReunionRecordForm', () => ({
  ReunionRecordForm: (props: any) => (
    <div
      data-testid="reunion-record-form"
      data-record-id={props.record.id}
      data-prontuario-search={props.prontuarioSearch}
    />
  ),
}));

const defaultProps = {
  drawerOpen: true,
  setDrawerOpen: vi.fn(),
  record: makeRecord(),
  isClosed: false,
  prontuarioSearch: '',
  isNewProntuario: false,
  selectedUnityId: null,
  filteredProntuarios: [],
  collection: {} as any,
  unities: [],
  onSaveRecord: vi.fn(),
  onRecordChange: vi.fn(),
  onProntuarioSelect: vi.fn(),
  onProntuarioSearch: vi.fn(),
  onUnityChange: vi.fn(),
  onToggleDelivery: vi.fn(),
};

describe('ReunionAttendanceDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('deve renderizar o drawer quando drawerOpen=true', () => {
    render(<ReunionAttendanceDrawer {...defaultProps} />);

    expect(screen.getByTestId('drawer-form')).toBeDefined();
  });

  it('não deve renderizar o drawer quando drawerOpen=false', () => {
    render(<ReunionAttendanceDrawer {...defaultProps} drawerOpen={false} />);

    expect(screen.queryByTestId('drawer-form')).toBeNull();
  });

  it('deve exibir título "Novo Atendimento" quando record.id=0', () => {
    render(<ReunionAttendanceDrawer {...defaultProps} record={makeRecord({ id: 0 })} />);

    expect(screen.getByTestId('drawer-title').textContent).toBe('Novo Atendimento');
  });

  it('deve exibir título "Editar Atendimento" quando record.id != 0', () => {
    render(<ReunionAttendanceDrawer {...defaultProps} record={makeRecord({ id: 5 })} />);

    expect(screen.getByTestId('drawer-title').textContent).toBe('Editar Atendimento');
  });

  it('deve chamar setDrawerOpen(false) ao clicar em Cancelar', () => {
    const setDrawerOpen = vi.fn();
    render(<ReunionAttendanceDrawer {...defaultProps} setDrawerOpen={setDrawerOpen} />);

    fireEvent.click(screen.getByTestId('drawer-close'));

    expect(setDrawerOpen).toHaveBeenCalledWith(false);
  });

  it('deve chamar onSaveRecord ao clicar em Salvar', () => {
    const onSaveRecord = vi.fn();
    render(<ReunionAttendanceDrawer {...defaultProps} onSaveRecord={onSaveRecord} />);

    fireEvent.click(screen.getByTestId('drawer-save'));

    expect(onSaveRecord).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar o ReunionRecordForm', () => {
    render(<ReunionAttendanceDrawer {...defaultProps} />);

    expect(screen.getByTestId('reunion-record-form')).toBeDefined();
  });

  it('deve passar prontuarioSearch para o ReunionRecordForm', () => {
    render(<ReunionAttendanceDrawer {...defaultProps} prontuarioSearch="busca123" />);

    const form = screen.getByTestId('reunion-record-form');
    expect(form.getAttribute('data-prontuario-search')).toBe('busca123');
  });

  it('não deve exibir botão de devolução quando isClosed=false', () => {
    render(
      <ReunionAttendanceDrawer
        {...defaultProps}
        isClosed={false}
        record={makeRecord({ id: 5 })}
      />
    );

    expect(screen.queryByTestId('drawer-header-actions')).toBeNull();
  });

  it('não deve exibir botão de devolução quando record.id=0 (novo atendimento)', () => {
    render(
      <ReunionAttendanceDrawer
        {...defaultProps}
        isClosed={true}
        record={makeRecord({ id: 0 })}
      />
    );

    expect(screen.queryByTestId('drawer-header-actions')).toBeNull();
  });

  it('deve exibir botão de devolução quando isClosed=true e record.id != 0', () => {
    render(
      <ReunionAttendanceDrawer
        {...defaultProps}
        isClosed={true}
        record={makeRecord({ id: 3, delivered: false })}
      />
    );

    expect(screen.getByTestId('drawer-header-actions')).toBeDefined();
    expect(screen.getByText('DEVOLVER')).toBeDefined();
  });

  it('deve exibir "DEVOLVIDO" quando record.delivered=true', () => {
    render(
      <ReunionAttendanceDrawer
        {...defaultProps}
        isClosed={true}
        record={makeRecord({ id: 3, delivered: true })}
      />
    );

    expect(screen.getByText('DEVOLVIDO')).toBeDefined();
  });

  it('deve chamar onToggleDelivery ao clicar no botão de devolução', () => {
    const onToggleDelivery = vi.fn();
    render(
      <ReunionAttendanceDrawer
        {...defaultProps}
        isClosed={true}
        record={makeRecord({ id: 3, delivered: false })}
        onToggleDelivery={onToggleDelivery}
      />
    );

    fireEvent.click(screen.getByText('DEVOLVER'));

    expect(onToggleDelivery).toHaveBeenCalledWith(3, false);
  });
});
