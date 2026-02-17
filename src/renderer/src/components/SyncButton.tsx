import { IconButton } from '@chakra-ui/react'
import { FiRefreshCw } from 'react-icons/fi'
import { useSyncData } from '../hooks/useSyncData'
import { toaster } from './ui/toaster'

export const SyncButton = () => {
  const { sync, isSyncing } = useSyncData()

  const handleSync = async () => {
    await sync()
    toaster.create({
      title: 'Dados sincronizados',
      description: 'As informações foram atualizadas com sucesso.',
      type: 'success'
    })
  }

  return (
    <IconButton
      aria-label="Sincronizar dados"
      onClick={handleSync}
      loading={isSyncing}
      variant="ghost"
      colorPalette="blue"
      borderRadius="full"
      size="sm"
    >
      <FiRefreshCw />
    </IconButton>
  )
}
