import { ReunionStatus } from '../../types/reunion-status'
import React from 'react'
import { Button } from '@chakra-ui/react'

export const RenderDrawerContent = (status: ReunionStatus) => {
  const content = {
    [ReunionStatus.NEW]: {
      title: 'Nova Reunião',
      primaryLabel: 'Salvar',
      secondaryLabel: 'Cancelar'
    },
    [ReunionStatus.IN_PROGRESS]: {
      title: 'Editar Reunião',
      primaryLabel: 'Salvar',
      secondaryLabel: 'Cancelar'
    },
    [ReunionStatus.FINISHED]: {
      title: 'Reunião Concluída',
      primaryLabel: 'Excluir',
      secondaryLabel: 'Cancelar'
    }
  }

  return content[status] || {}
}
