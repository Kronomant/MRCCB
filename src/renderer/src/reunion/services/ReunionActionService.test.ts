import { describe, it, expect } from 'vitest';
import { ReunionActionService } from './ReunionActionService';
import { RecordType } from '../../hooks/records/useRecords';

describe('ReunionActionService', () => {
  describe('isValidProntuarioNumber', () => {
    it('should return true for valid numbers greater than 0', () => {
      expect(ReunionActionService.isValidProntuarioNumber('123')).toBe(true);
      expect(ReunionActionService.isValidProntuarioNumber('1')).toBe(true);
    });

    it('should return false for invalid strings, negatives or zero', () => {
      expect(ReunionActionService.isValidProntuarioNumber('0')).toBe(false);
      expect(ReunionActionService.isValidProntuarioNumber('-5')).toBe(false);
      expect(ReunionActionService.isValidProntuarioNumber('abc')).toBe(false);
      expect(ReunionActionService.isValidProntuarioNumber('123a')).toBe(false);
      expect(ReunionActionService.isValidProntuarioNumber('')).toBe(false);
    });
  });

  describe('formatSavePayload', () => {
    it('should format payload correctly based on record and prontuario data', () => {
      const mockRecord: RecordType = {
        id: 0,
        prontuarioId: 0,
        prontuarioNumber: 0,
        ministerio: true,
        roupas: false,
        valor: 150.5,
        cestas: 2,
        labels: ['Valor total aprovado', 'Somente roupas', 'Emergencial', 'Representação', 'Roupas'],
        representacao: false,
        somenteRoupas: false,
        valorTotalAprovado: false,
        delivered: true,
      };

      const payload = ReunionActionService.formatSavePayload({
        record: mockRecord,
        prontuarioId: 10,
        prontuarioNumber: 5050,
        reunionId: 1,
        reunionDate: '2023-10-15',
      });

      expect(payload).toEqual({
        prontuarioId: 10,
        reunionId: 1,
        date: '2023-10-15',
        aprovedValue: true, 
        value: 150.5,
        foodBasketQuantity: 2,
        onlyClothes: true, 
        emergency: true, 
        representacao: true, 
        devolvido: true,
        repeat: false,
        ministerio: true,
        roupas: true, 
        prontuarioNumber: 5050,
      });
    });

    it('should fallback to current date if reunionDate is not provided', () => {
      const mockRecord = { labels: [] } as unknown as RecordType;
      const payload = ReunionActionService.formatSavePayload({
        record: mockRecord,
        prontuarioId: 1,
        prontuarioNumber: 1,
        reunionId: 1,
      });
      
      const today = new Date().toISOString().split('T')[0];
      expect(payload.date).toBe(today);
    });
  });
});
