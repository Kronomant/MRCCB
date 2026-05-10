import { useMemo, useCallback } from 'react'
import { useReunion } from '../reunion/useReunion'
import { useAtendimentos } from '../atendimento/useAtendimentos'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface RecordType {
  id: number
  prontuarioId: number
  prontuarioNumber: number
  ministerio: boolean
  valor: number
  cestas: number
  labels: string[]
  representacao: boolean
  somenteRoupas: boolean
  valorTotalAprovado: boolean
  delivered: boolean
}

export const useRecords = (reunionId: number) => {
  const queryClient = useQueryClient()
  const { reunions } = useReunion(reunionId)
  const { atendimentos, createAtendimento, updateAtendimento, deleteAtendimento } =
    useAtendimentos(reunionId)

  const toggleDelivery = useMutation({
    mutationFn: async ({
      atendimentoId,
      currentStatus
    }: {
      atendimentoId: number
      currentStatus: boolean
    }) => {
      return await window.electron.ipcRenderer.invoke(
        'atendimento:toggleDelivery',
        atendimentoId,
        !currentStatus
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos', reunionId] })
      queryClient.invalidateQueries({ queryKey: ['reunions'] })
    }
  })

  const mapAtendimentoToRecord = useCallback((atendimento: Atendimento): RecordType => {
    const labels: string[] = []
    if (atendimento.aprovedValue) labels.push('Valor total aprovado')
    if (atendimento.emergency) labels.push('Emergencial')
    if (atendimento.onlyClothes) labels.push('Somente roupas')
    if (atendimento.representacao) labels.push('Representação')
    if (atendimento.repeat) labels.push('Repetição')

    return {
      id: atendimento.id!,
      prontuarioId: atendimento.prontuarioId,
      prontuarioNumber: atendimento.prontuarioNumber,
      ministerio: Boolean(atendimento.ministerio),
      valor: atendimento.value,
      cestas: atendimento.foodBasketQuantity,
      labels,
      representacao: atendimento.representacao,
      somenteRoupas: atendimento.onlyClothes,
      valorTotalAprovado: atendimento.aprovedValue,
      delivered: Boolean(atendimento.devolvido)
    }
  }, [])

  const records = useMemo<RecordType[]>(() => {
    return atendimentos?.data ? atendimentos.data.map(mapAtendimentoToRecord) : []
  }, [atendimentos?.data, mapAtendimentoToRecord])

  const summary = useMemo(() => {
    const devolvidoCount = records.filter((r) => r.delivered).length
    return {
      totalAtribuido: reunions.data?.value ?? 0,
      atendimentos: records.length,
      cestas: records.reduce((acc, r) => acc + r.cestas, 0),
      totalGasto: records.reduce((acc, r) => acc + r.valor, 0),
      entregues: devolvidoCount,
      data: reunions.data?.date ?? ''
    }
  }, [reunions.data, records])

  return {
    records,
    summary,
    isLoading: (atendimentos.isLoading || reunions.isLoading) as boolean,
    createAtendimento,
    updateAtendimento,
    deleteAtendimento,
    reunions,
    toggleDelivery
  }
}
