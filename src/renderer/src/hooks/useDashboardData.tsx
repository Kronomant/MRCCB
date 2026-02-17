import { useQuery } from '@tanstack/react-query'
import { getAllAtendimentos } from '../services/atendimentoService'
import { getAllProntuarios } from '../services/prontuarioService'
import { getAllUnities } from '../services/unityService'

export const useDashboardData = () => {
  const atendimentosQuery = useQuery({
    queryKey: ['all-atendimentos'],
    queryFn: getAllAtendimentos
  })

  const prontuariosQuery = useQuery({
    queryKey: ['all-prontuarios'],
    queryFn: getAllProntuarios
  })

  const unitiesQuery = useQuery({
    queryKey: ['all-unities'],
    queryFn: getAllUnities
  })

  const isLoading = atendimentosQuery.isLoading || prontuariosQuery.isLoading || unitiesQuery.isLoading
  const isError = atendimentosQuery.isError || prontuariosQuery.isError || unitiesQuery.isError

  return {
    atendimentos: atendimentosQuery.data || [],
    prontuarios: prontuariosQuery.data || [],
    unities: unitiesQuery.data || [],
    isLoading,
    isError
  }
}
