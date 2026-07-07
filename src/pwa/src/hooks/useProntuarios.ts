import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useProntuarios() {
  return useQuery({
    queryKey: ['prontuarios'],
    queryFn: () => api.prontuarios.list()
  })
}

export function useProntuario(id: number) {
  return useQuery({
    queryKey: ['prontuarios', id],
    queryFn: () => api.prontuarios.get(id),
    enabled: !!id
  })
}
