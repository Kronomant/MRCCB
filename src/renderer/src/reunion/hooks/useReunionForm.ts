import { useState, useMemo } from 'react';
import { useRecords, RecordType } from '../../hooks/records/useRecords';
import { useProntuarios } from '../../hooks/prontuario';
import { ReunionActionService } from '../services/ReunionActionService';
import { getProntuarioByNumber } from '../../services/prontuarioService';
import { createListCollection } from '@ark-ui/react/collection';

const defaultRecord: RecordType = {
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
};

export const useReunionForm = (reunionId: number) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formState, setFormState] = useState({
    record: defaultRecord,
    prontuarioSearch: '',
    prontuarioError: null as string | null,
    selectedUnityId: null as number | null,
    isNewProntuario: false,
  });

  const {
    createAtendimento,
    updateAtendimento,
    reunions,
  } = useRecords(reunionId);

  const {
    activeProntuarios,
    createProntuario,
  } = useProntuarios({ fetchAll: false, fetchActive: drawerOpen });

  const updateRecord = (updates: Partial<RecordType>) => {
    setFormState((prev) => ({
      ...prev,
      record: { ...prev.record, ...updates },
    }));
  };

  const handleProntuarioSelect = (value: string) => {
    if (!value || value === '') {
      setFormState((prev) => ({
        ...prev,
        record: { ...prev.record, prontuarioId: 0, prontuarioNumber: 0 },
        prontuarioSearch: '',
        prontuarioError: null,
        selectedUnityId: null,
        isNewProntuario: false,
      }));
      return;
    }

    if (value.startsWith('new-')) {
      const numStr = value.replace('new-', '');
      const num = Number(numStr);
      setFormState((prev) => ({
        ...prev,
        record: { ...prev.record, prontuarioId: 0, prontuarioNumber: num },
        prontuarioSearch: numStr,
        prontuarioError: null,
        selectedUnityId: null,
        isNewProntuario: true,
      }));
      return;
    }

    const selectedProntuario = activeProntuarios?.find((p) => p.id === Number(value));
    if (selectedProntuario) {
      setFormState((prev) => ({
        ...prev,
        record: {
          ...prev.record,
          prontuarioId: selectedProntuario.id,
          prontuarioNumber: selectedProntuario.number,
          ministerio: selectedProntuario.ministry,
        },
        prontuarioSearch: String(selectedProntuario.number),
        prontuarioError: null,
        selectedUnityId: selectedProntuario.unityId,
        isNewProntuario: false,
      }));
    }
  };

  const updateProntuarioSearch = (val: string) => {
    setFormState((prev) => {
      if (prev.prontuarioSearch === val) return prev;
      if (val === '') {
        return {
          ...prev,
          prontuarioSearch: '',
          prontuarioError: null,
          isNewProntuario: false,
          record: { ...prev.record, prontuarioId: 0, prontuarioNumber: 0 },
        };
      }
      return {
        ...prev,
        prontuarioSearch: val,
        isNewProntuario: false,
        prontuarioError: ReunionActionService.isValidProntuarioNumber(val)
          ? null
          : 'Número de prontuário inválido',
      };
    });
  };

  const updateUnityId = (id: number | null) => {
    setFormState((prev) => ({ ...prev, selectedUnityId: id }));
  };

  const resolveProntuario = async () => {
    const { record, prontuarioSearch, selectedUnityId } = formState;

    if (record.prontuarioId) return { id: record.prontuarioId, number: record.prontuarioNumber };
    if (prontuarioSearch.trim() === '') return null;
    
    if (!ReunionActionService.isValidProntuarioNumber(prontuarioSearch.trim())) {
      setFormState((prev) => ({ ...prev, prontuarioError: 'Número de prontuário inválido' }));
      return null;
    }

    const typedNumber = Number(prontuarioSearch.trim());
    const existing = await getProntuarioByNumber(typedNumber);

    if (existing) return { id: existing.id!, number: existing.number };

    const created = await createProntuario.mutateAsync({
      number: typedNumber,
      unityId: selectedUnityId ?? 1,
      ministry: record.ministerio,
      status: 'active',
    });

    return { id: created.id!, number: created.number };
  };

  const handleSave = async () => {
    try {
      const prontuarioData = await resolveProntuario();
      if (!prontuarioData && formState.prontuarioSearch.trim() !== '') return;

      const { record } = formState;
      const payload = ReunionActionService.formatSavePayload({
        record,
        prontuarioId: prontuarioData?.id ?? 0,
        prontuarioNumber: prontuarioData?.number ?? 0,
        reunionId,
        reunionDate: reunions.data?.date,
      });

      if (record.id === 0) {
        await createAtendimento.mutateAsync(payload);
      } else {
        await updateAtendimento.mutateAsync({ id: record.id, ...payload });
      }

      setDrawerOpen(false);
    } catch (err) {
      console.error('Falha ao salvar atendimento:', err);
    }
  };

  const filteredProntuarios = useMemo(() => {
    const query = formState.prontuarioSearch.trim();
    const baseItems = (activeProntuarios ?? []).map((p) => ({
      label: String(p.number),
      value: String(p.id),
    }));

    const filtered = baseItems.filter((item) => item.label.includes(query));

    if (query && ReunionActionService.isValidProntuarioNumber(query)) {
      const hasExactMatch = baseItems.some((item) => item.label === query);
      if (!hasExactMatch) {
        filtered.unshift({
          label: query,
          value: `new-${query}`,
        });
      }
    }
    return filtered;
  }, [activeProntuarios, formState.prontuarioSearch]);

  const collection = useMemo(
    () => createListCollection({ items: filteredProntuarios }),
    [filteredProntuarios]
  );

  return {
    drawerOpen,
    setDrawerOpen,
    formState,
    setFormState,
    updateRecord,
    handleProntuarioSelect,
    updateProntuarioSearch,
    updateUnityId,
    handleSave,
    defaultRecord,
    filteredProntuarios,
    collection,
  };
};
