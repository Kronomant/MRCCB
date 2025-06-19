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

  interface Enchiridion {
    id: number
    number: number
    unityId: number
    ministry: boolean
  }

  interface Treatment {
    id: number
    enchiridionId: number
    reunionId: number
    unityId: number
    date: String
    aprovedValue: boolean
    value: number
    foodBasketQuantity: number
    onlyClothes: boolean
    emergency: boolean
    returned: boolean
    repeat: boolean
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

  type Column<T> = {
    header: string
    accessor?: keyof T
    customRender?: (row: T) => React.ReactNode
  }
}

export enum ReunionStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished'
}

export {}
