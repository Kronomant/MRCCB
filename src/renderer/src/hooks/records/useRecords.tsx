import { useMemo, useCallback } from 'react'
import { useReunion } from '../reunion/useReunion'
import { useAtendimentos } from '../atendimento/useAtendimentos'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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

  // Fetch delivery statuses
  const deliveries = useQuery({
    queryKey: ['deliveries', reunionId],
    queryFn: async () => {
      return (await window.electron.ipcRenderer.invoke(
        'prontuarioDelivery:getByReunion',
        reunionId
      )) as ProntuarioDeliveryData[]
    }
  })

  // Mutation to toggle delivery status between pendente <-> devolvido
  const toggleDelivery = useMutation({
    mutationFn: async ({
      prontuarioId,
      currentStatus
    }: {
      prontuarioId: number
      currentStatus: boolean
    }) => {
      const by = 'Usuario'
      if (currentStatus) {
        // devolvido → pendente
        return await window.electron.ipcRenderer.invoke(
          'prontuarioDelivery:updateStatus',
          prontuarioId,
          reunionId,
          'pendente',
          by
        )
      } else {
        // pendente → devolvido
        return await window.electron.ipcRenderer.invoke(
          'prontuarioDelivery:markReturned',
          prontuarioId,
          reunionId,
          by
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries', reunionId] })
      queryClient.invalidateQueries({ queryKey: ['deliverySummaries'] })
    }
  })

  const deliveryMap = useMemo(() => {
    const map = new Map<number, string>()
    deliveries.data?.forEach((d) => {
      map.set(d.prontuarioId, d.status)
    })
    return map
  }, [deliveries.data])

  const mapAtendimentoToRecord = useCallback(
    (atendimento: Atendimento): RecordType => {
      const labels: string[] = []
      if (atendimento.aprovedValue) labels.push('Valor total aprovado')
      if (atendimento.emergency) labels.push('Emergencial')
      if (atendimento.onlyClothes) labels.push('Somente roupas')
      if (atendimento.returned) labels.push('Representação')
      if (atendimento.repeat) labels.push('Repetição')

      const deliveryStatus = deliveryMap.get(atendimento.prontuarioId)
      const isDelivered = deliveryStatus === 'devolvido' || deliveryStatus === 'entregue'

      return {
        id: atendimento.id!,
        prontuarioId: atendimento.prontuarioId,
        prontuarioNumber: atendimento.prontuarioNumber,
        ministerio: Boolean(atendimento.ministerio),
        valor: atendimento.value,
        cestas: atendimento.foodBasketQuantity,
        labels,
        representacao: atendimento.returned,
        somenteRoupas: atendimento.onlyClothes,
        valorTotalAprovado: atendimento.aprovedValue,
        delivered: isDelivered
      }
    },
    [deliveryMap]
  )

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
    isLoading: (atendimentos.isLoading || reunions.isLoading || deliveries.isLoading) as boolean,
    createAtendimento,
    updateAtendimento,
    deleteAtendimento,
    reunions,
    toggleDelivery
  }
}
