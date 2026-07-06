import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useReunions(params?: { startDate?: string; endDate?: string; status?: string }) {
  return useQuery({
    queryKey: ['reunions', params],
    queryFn: () => api.reunions.list(params)
  })
}

export function useReunion(id: number) {
  return useQuery({
    queryKey: ['reunion', id],
    queryFn: () => api.reunions.get(id),
    enabled: !!id
  })
}
