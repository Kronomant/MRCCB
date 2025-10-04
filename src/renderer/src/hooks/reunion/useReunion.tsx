import { useQuery } from '@tanstack/react-query'
import { getReunionById } from '../../services/reunionService'

export const useReunion = (id: number) => {
  const reunions = useQuery<Reunion | undefined>({
    queryKey: ['reunion', id],
    queryFn: () => getReunionById(id!),
    enabled: !!id // só roda se id for truthy
  })

  return {
    reunions
  }
}
