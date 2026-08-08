import { useState, useMemo, useCallback } from 'react';
import { useRecords, RecordType } from '../../hooks/records/useRecords';

export const useReunionTable = (reunionId: number) => {
  const [search, setSearch] = useState('');

  const {
    records,
    deleteAtendimento,
    toggleDelivery,
  } = useRecords(reunionId);

  const filteredRecords = useMemo(
    () => records.filter((r) => String(r.prontuarioNumber).includes(search)),
    [records, search]
  );

  const handleDelete = useCallback(
    (id: number) => {
      deleteAtendimento.mutate(id);
    },
    [deleteAtendimento]
  );

  const handleToggleDelivery = async (
    atendimentoId: number,
    currentStatus: boolean,
    updateRecordLocally?: (updates: Partial<RecordType>) => void
  ) => {
    try {
      await toggleDelivery.mutateAsync({ atendimentoId, currentStatus });
      if (updateRecordLocally) {
        updateRecordLocally({ delivered: !currentStatus });
      }
    } catch (err) {
      console.error('Falha ao alternar entrega:', err);
    }
  };

  return {
    search,
    setSearch,
    records,
    filteredRecords,
    handleDelete,
    handleToggleDelivery,
  };
};
