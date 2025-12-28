import { useMemo } from 'react'
import { useReunion } from '../reunion/useReunion'
import { useAtendimentos } from '../atendimento/useAtendimentos'

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
}

export const useRecords = (reunionId: number) => {
  const { reunions } = useReunion(reunionId)
  const { atendimentos, createAtendimento, updateAtendimento, deleteAtendimento } =
    useAtendimentos(reunionId)

  const mapAtendimentoToRecord = (atendimento: Atendimento): RecordType => {
    const labels: string[] = []
    if (atendimento.aprovedValue) labels.push('Valor total aprovado')
    if (atendimento.emergency) labels.push('Emergencial')
    if (atendimento.onlyClothes) labels.push('Somente roupas')
    if (atendimento.returned) labels.push('Representação')
    if (atendimento.repeat) labels.push('Repetição')

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
      valorTotalAprovado: atendimento.aprovedValue
    }
  }

  const records = useMemo<RecordType[]>(() => {
    return atendimentos?.data ? atendimentos.data.map(mapAtendimentoToRecord) : []
  }, [atendimentos?.data])

  const summary = useMemo(() => {
    return {
      totalAtribuido: reunions.data?.value ?? 0,
      atendimentos: records.length,
      cestas: records.reduce((acc, r) => acc + r.cestas, 0),
      totalGasto: records.reduce((acc, r) => acc + r.valor, 0),
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
    reunions
  }
}