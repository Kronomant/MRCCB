import { useMemo } from 'react'
import { useReunion } from '../reunion/useReunion'
import { useTreatments } from '../treatment/useTreatments'

export interface RecordType {
  id: number
  prontuario: number
  ministerio: boolean
  valor: number
  cestas: number
  unidade: string
  labels: string[]
  representacao: boolean
  somenteRoupas: boolean
  valorTotalAprovado: boolean
}

export const useRecords = (reunionId: number) => {
  const { reunions } = useReunion(reunionId)
  const { treatments, createTreatment, updateTreatment, deleteTreatment } = useTreatments(reunionId)

  const mapTreatmentToRecord = (treatment: Treatment): RecordType => {
    const labels: string[] = []
    if (treatment.aprovedValue) labels.push('Valor total aprovado')
    if (treatment.emergency) labels.push('Emergencial')
    if (treatment.onlyClothes) labels.push('Somente roupas')
    if (treatment.returned) labels.push('Representação')
    return {
      id: treatment.id!,
      prontuario: treatment.enchiridionId,
      ministerio: false,
      valor: treatment.value,
      cestas: treatment.foodBasketQuantity,
      unidade: String(treatment.unityId ?? ''),
      labels,
      representacao: treatment.returned,
      somenteRoupas: treatment.onlyClothes,
      valorTotalAprovado: treatment.aprovedValue
    }
  }

  const records = useMemo<RecordType[]>(() => {
    return treatments?.data ? treatments.data.map(mapTreatmentToRecord) : []
  }, [treatments?.data])

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
    isLoading: (treatments.isLoading || reunions.isLoading) as boolean,
    createTreatment,
    updateTreatment,
    deleteTreatment,
    reunions
  }
}