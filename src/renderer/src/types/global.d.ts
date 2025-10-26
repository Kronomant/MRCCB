import type { ReunionStatus } from './reunion-status'

declare global {
  interface Reunion {
    id: number
    name: string
    value: number
    treatmentQuantity: number
    foodBasketQuantity: number
    date: string
    status: ReunionStatus
  }

  interface Unity {
    id: number
    name: string
  }

  interface Prontuario {
    id: number
    number: number
    unityId: number
    ministry: boolean
    createdAt: string
    updatedAt: string
    status: 'active' | 'inactive'
  }

  interface Atendimento {
    id: number
    prontuarioId: number
    reunionId: number
    date: string
    aprovedValue: boolean
    value: number
    foodBasketQuantity: number
    onlyClothes: boolean
    emergency: boolean
    returned: boolean
    repeat: boolean
    createdAt: string
    updatedAt: string
  }

  interface FoodBasket {
    id: number
    date: String
    exit: boolean
  }

  interface DropboxBackup {
    id: number
    dropboxAccount: string
    backupPath: string
  }

  interface Treatment {
    id: number
    enchiridionId: number
    reunionId: number
    unityId: number
    date: string
    aprovedValue: boolean
    value: number
    foodBasketQuantity: number
    onlyClothes: boolean
    emergency: boolean
    returned: boolean
    repeat: boolean
    createdAt?: string
    updatedAt?: string
  }

  interface Enchiridion {
    id: number
    number: number
    unityId: number
    ministry: boolean
  }

  type Column<T> = {
    header: string
    accessor?: keyof T
    customRender?: (row: T) => React.ReactNode
  }

  // Tipos auxiliares para Prontuario
  type CreateProntuario = Omit<Prontuario, 'id' | 'createdAt' | 'updatedAt'>
  type UpdateProntuario = Partial<CreateProntuario>

  // Tipos auxiliares para Atendimento
  type CreateAtendimento = Omit<Atendimento, 'id' | 'createdAt' | 'updatedAt'>
  type UpdateAtendimento = Partial<CreateAtendimento>
}

export enum ReunionStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished'
}

export {}
