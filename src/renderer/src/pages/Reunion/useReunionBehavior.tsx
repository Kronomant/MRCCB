import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecords } from '../../hooks'
import { useProntuarios } from '../../hooks/prontuario'
import { useUnities } from '../../hooks/unity'
import { getProntuarioByNumber } from '../../services/prontuarioService'
import { RecordType } from '../../hooks/records/useRecords'
import { createListCollection } from '@ark-ui/react/collection'

// Constants derived from UI needs but containing logic mappings
export const LABEL_COLORS: Record<string, string> = {
  Emergencial: 'red',
  'Somente roupas': 'blue',
  'Valor total aprovado': 'green',
  Representação: 'purple'
}

const defaultRecord: RecordType = {
  id: 0,
  prontuarioId: 0,
  prontuarioNumber: 0,
  ministerio: false,
  valor: 0,
  cestas: 0,
  labels: [],
  representacao: false,
  somenteRoupas: false,
  valorTotalAprovado: false
}

const isValidProntuarioNumber = (value: string) => /^\d+$/.test(value) && Number(value) > 0

export const useReunionBehavior = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const reunionId = Number(id)

  const {
    records: hookRecords,
    summary,
    isLoading,
    createAtendimento,
    updateAtendimento,
    deleteAtendimento,
    reunions
  } = useRecords(reunionId)

  const { prontuarios, activeProntuarios, createProntuario } = useProntuarios()
  const { unities } = useUnities()

  // State consolidation
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [formState, setFormState] = useState({
    record: defaultRecord,
    prontuarioSearch: '',
    prontuarioError: null as string | null,
    selectedUnityId: null as number | null,
    isNewProntuario: false
  })

  // Derived state (Functional approach - memoized selectors)
  const filteredRecords = useMemo(() => 
    hookRecords.filter((r) => String(r.prontuarioNumber).includes(search)),
    [hookRecords, search]
  )

  const filteredProntuarios = useMemo(() => {
    const query = formState.prontuarioSearch.trim()
    const baseItems = (activeProntuarios ?? []).map((p) => ({
      label: String(p.number),
      value: String(p.id)
    }))

    const filtered = baseItems.filter((item) => item.label.includes(query))

    if (query && isValidProntuarioNumber(query)) {
      const hasExactMatch = baseItems.some((item) => item.label === query)
      if (!hasExactMatch) {
        filtered.unshift({
          label: query,
          value: `new-${query}`
        })
      }
    }
    return filtered
  }, [activeProntuarios, formState.prontuarioSearch])

  const collection = useMemo(() => 
    createListCollection({ items: filteredProntuarios }),
    [filteredProntuarios]
  )

  // Handlers - useCallbacks for stability
  const handleAdd = useCallback(() => {
    const reunionData = reunions.data
    setFormState({
      record: {
        ...defaultRecord,
        valor: 0,
        cestas: reunionData?.foodBasketQuantity || 0
      },
      prontuarioSearch: '',
      prontuarioError: null,
      selectedUnityId: null,
      isNewProntuario: false
    })
    setDrawerOpen(true)
  }, [reunions.data])

  const handleEdit = useCallback((record: RecordType) => {
    const prontuario = prontuarios?.find((p) => p.id === record.prontuarioId)
    setFormState({
      record,
      prontuarioSearch: String(record.prontuarioNumber || ''),
      prontuarioError: null,
      selectedUnityId: prontuario?.unityId ?? null,
      isNewProntuario: record.id !== 0 && !record.prontuarioId
    })
    setDrawerOpen(true)
  }, [prontuarios])

  const handleView = useCallback((record: RecordType) => {
    const prontuario = prontuarios?.find((p) => p.id === record.prontuarioId)
    setFormState({
      record,
      prontuarioSearch: String(record.prontuarioNumber || ''),
      prontuarioError: null,
      selectedUnityId: prontuario?.unityId ?? null,
      isNewProntuario: record.id !== 0 && !record.prontuarioId
    })
    setDrawerOpen(true)
  }, [prontuarios])

  const handleDelete = useCallback((id: number) => {
     deleteAtendimento.mutate(id)
  }, [deleteAtendimento])

  const resolveProntuario = async () => {
    const { record, prontuarioSearch, selectedUnityId } = formState
    
    if (record.prontuarioId) return { id: record.prontuarioId, number: record.prontuarioNumber }
    if (prontuarioSearch.trim() === '') return null
    if (!isValidProntuarioNumber(prontuarioSearch.trim())) {
      setFormState(prev => ({ ...prev, prontuarioError: 'Número de prontuário inválido' }))
      return null
    }

    const typedNumber = Number(prontuarioSearch.trim())
    const existing = await getProntuarioByNumber(typedNumber)
    
    if (existing) return { id: existing.id!, number: existing.number }

    const created = await createProntuario.mutateAsync({
      number: typedNumber,
      unityId: selectedUnityId ?? 1,
      ministry: record.ministerio,
      status: 'active'
    })
    
    return { id: created.id!, number: created.number }
  }

  const handleSave = async () => {
    try {
      const prontuarioData = await resolveProntuario()
      if (!prontuarioData && formState.prontuarioSearch.trim() !== '') return

      const { record } = formState
      const payload = {
        prontuarioId: prontuarioData?.id ?? 0,
        reunionId,
        date: reunions.data?.date ?? new Date().toISOString().split('T')[0],
        aprovedValue: record.labels.includes('Valor total aprovado'),
        value: record.valor,
        foodBasketQuantity: record.cestas,
        onlyClothes: record.labels.includes('Somente roupas'),
        emergency: record.labels.includes('Emergencial'),
        returned: record.labels.includes('Representação'),
        repeat: false,
        ministerio: record.ministerio,
        prontuarioNumber: prontuarioData?.number ?? 0
      }

      const action = record.id === 0 
        ? createAtendimento.mutateAsync(payload)
        : updateAtendimento.mutateAsync({ id: record.id, ...payload })

      await action
      setDrawerOpen(false)
    } catch (err) {
      console.error('Falha ao salvar atendimento:', err)
    }
  }

  const handleProntuarioSelect = (value: string) => {
    // Se não houver valor (botão de limpar), resetamos tudo
    if (!value || value === '') {
      setFormState((prev) => ({
        ...prev,
        record: { ...prev.record, prontuarioId: 0, prontuarioNumber: 0 },
        prontuarioSearch: '',
        prontuarioError: null,
        selectedUnityId: null,
        isNewProntuario: false
      }))
      return
    }

    if (value.startsWith('new-')) {
      const numStr = value.replace('new-', '')
      const num = Number(numStr)
      setFormState((prev) => ({
        ...prev,
        record: { ...prev.record, prontuarioId: 0, prontuarioNumber: num },
        prontuarioSearch: numStr,
        prontuarioError: null,
        selectedUnityId: null,
        isNewProntuario: true
      }))
      return
    }

    const selectedProntuario = activeProntuarios?.find((p) => p.id === Number(value))
    if (selectedProntuario) {
      setFormState((prev) => ({
        ...prev,
        record: {
          ...prev.record,
          prontuarioId: selectedProntuario.id,
          prontuarioNumber: selectedProntuario.number,
          ministerio: selectedProntuario.ministry
        },
        prontuarioSearch: String(selectedProntuario.number),
        prontuarioError: null,
        selectedUnityId: selectedProntuario.unityId,
        isNewProntuario: false
      }))
    }
  }

  const updateRecord = (updates: Partial<RecordType>) => {
    setFormState(prev => ({
      ...prev,
      record: { ...prev.record, ...updates }
    }))
  }

  const updateProntuarioSearch = (val: string) => {
    setFormState((prev) => {
      if (prev.prontuarioSearch === val) return prev

      if (val === '' && prev.isNewProntuario && prev.record.prontuarioNumber !== 0) {
        return prev
      }

      if (val === '') {
        return {
          ...prev,
          prontuarioSearch: '',
          prontuarioError: null,
          isNewProntuario: false,
          record: { ...prev.record, prontuarioId: 0, prontuarioNumber: 0 }
        }
      }

      return {
        ...prev,
        prontuarioSearch: val,
        isNewProntuario: false,
        prontuarioError:
          val && !isValidProntuarioNumber(val) ? 'Número de prontuário inválido' : null
      }
    })
  }

  const updateUnityId = (id: number | null) => {
    setFormState(prev => ({ ...prev, selectedUnityId: id }))
  }

  return {
    navigate,
    drawerOpen,
    setDrawerOpen,
    search,
    setSearch,
    formState,
    isLoading,
    summary,
    filteredRecords,
    filteredProntuarios,
    unities,
    handlers: {
      handleAdd,
      handleEdit,
      handleView,
      handleDelete,
      handleSave,
      handleProntuarioSelect,
      updateRecord,
      updateProntuarioSearch,
      updateUnityId,
      isValidProntuarioNumber,
      collection
    }
  }
}
