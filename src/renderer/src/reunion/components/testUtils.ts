import { RecordType } from '../../hooks/records/useRecords';

export const makeRecord = (overrides: Partial<RecordType> = {}): RecordType => ({
  id: 0,
  prontuarioId: 0,
  prontuarioNumber: 0,
  ministerio: false,
  roupas: false,
  valor: 0,
  cestas: 0,
  labels: [],
  representacao: false,
  somenteRoupas: false,
  valorTotalAprovado: false,
  delivered: false,
  ...overrides,
});
