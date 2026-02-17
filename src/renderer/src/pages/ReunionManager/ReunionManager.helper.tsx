import { ReunionStatus } from '../../types/reunion-status'

export const statusMap = {
  [ReunionStatus.NEW]: { label: 'Prevista', colorScheme: 'green' },
  [ReunionStatus.IN_PROGRESS]: { label: 'Em Andamento', colorScheme: 'blue' },
  [ReunionStatus.FINISHED]: { label: 'Encerrada', colorScheme: 'orange' }
}
