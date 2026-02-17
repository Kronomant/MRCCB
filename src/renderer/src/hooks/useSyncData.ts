import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export const useSyncData = () => {
  const queryClient = useQueryClient()
  const [isSyncing, setIsSyncing] = useState(false)

  const sync = async () => {
    setIsSyncing(true)
    try {
      await queryClient.invalidateQueries()
      await queryClient.refetchQueries()
    } catch (error) {
      console.error('Erro ao sincronizar dados:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  return {
    sync,
    isSyncing
  }
}
