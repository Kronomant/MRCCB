import { RecordType } from '../../hooks/records/useRecords';

export interface FormatPayloadParams {
  record: RecordType;
  prontuarioId: number;
  prontuarioNumber: number;
  reunionId: number;
  reunionDate?: string;
}

export const ReunionActionService = {
  isValidProntuarioNumber: (value: string): boolean => {
    return /^\d+$/.test(value) && Number(value) > 0;
  },

  formatSavePayload: (params: FormatPayloadParams) => {
    const { record, prontuarioId, prontuarioNumber, reunionId, reunionDate } = params;
    
    return {
      prontuarioId,
      reunionId,
      date: reunionDate || new Date().toISOString().split('T')[0],
      aprovedValue: record.labels.includes('Valor total aprovado'),
      value: record.valor,
      foodBasketQuantity: record.cestas,
      onlyClothes: record.labels.includes('Somente roupas'),
      emergency: record.labels.includes('Emergencial'),
      representacao: record.labels.includes('Representação'),
      devolvido: record.delivered,
      repeat: false,
      ministerio: record.ministerio,
      roupas: record.labels.includes('Roupas'),
      prontuarioNumber,
    };
  }
};
