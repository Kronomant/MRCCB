/// <reference path="../types/global.d.ts" />
import { faker } from '@faker-js/faker'
import { ReunionStatus } from '../types/reunion-status'

// Importar os tipos do global.d.ts
type Treatment = globalThis.Treatment
type Enchiridion = globalThis.Enchiridion

const lenghts = {
  unities: 2,
  reunions: 2,
  enchiridions: 5,
  treatments: 25,
  foodBasket: 1,
  dropboxBackup: 1
}

const generateUnities = (length: number): Array<Unity> => {
  return Array.from({ length }, () => ({
    id: faker.number.int(1000),
    name: `Unidade ${faker.location.city()}`
  }))
}

const generateReunions = (length: number): Array<Reunion> => {
  return Array.from({ length }, () => ({
    id: faker.number.int(1000),
    name: faker.helpers.arrayElement([
      'Reunião de Atendimento',
      'Reunião de Atendimento Ministério'
    ]),
    value: faker.number.float({ fractionDigits: 2, max: 20000 }),
    treatmentQuantity: faker.number.int(20),
    foodBasketQuantity: faker.number.int(2),
    date: faker.date.recent({ days: 10 }).toISOString().split('T')[0].replaceAll('-', '/'),
    status: faker.helpers.arrayElement([
      ReunionStatus.NEW,
      ReunionStatus.IN_PROGRESS,
      ReunionStatus.FINISHED
    ])
  }))
}

const generateEnchiridions = (unities: Unity[], length: number): Array<Enchiridion> => {
  return Array.from({ length }, () => ({
    id: faker.number.int(1000),
    number: faker.number.int(3000),
    unityId: faker.helpers.arrayElement(unities).id,
    ministry: faker.datatype.boolean()
  }))
}

const generateTreatments = (unities: Unity[], length: number): Array<Treatment> => {
  return Array.from({ length }, () => ({
    id: faker.number.int(1000),
    enchiridionId: faker.helpers.arrayElement(enchiridions).id,
    reunionId: faker.helpers.arrayElement(reunions).id,
    unityId: faker.helpers.arrayElement(unities).id,
    date: faker.date.recent({ days: 60 }).toISOString().split('T')[0].replaceAll('-', '/'),
    aprovedValue: faker.datatype.boolean(),
    value: faker.number.float({ max: 1000, multipleOf: 100 }),
    foodBasketQuantity: faker.number.int(2),
    onlyClothes: faker.datatype.boolean(),
    emergency: faker.datatype.boolean(),
    returned: faker.datatype.boolean(0.4),
    repeat: faker.datatype.boolean(0.2)
  }))
}

const generateFoodBaskets = (length: number): Array<FoodBasket> => {
  return Array.from({ length }, () => ({
    id: faker.number.int(1000),
    date: faker.date.recent({ days: 10 }).toISOString().split('T')[0].replaceAll('-', '/'),
    exit: faker.datatype.boolean()
  }))
}

const generateDropboxBackup = (length: number): Array<DropboxBackup> => {
  return Array.from({ length }, () => ({
    id: faker.number.int(1000),
    dropboxAccount: faker.finance.accountName(),
    backupPath: faker.system.directoryPath()
  }))
}

const unities: Array<Unity> = generateUnities(lenghts.unities)
const reunions: Array<Reunion> = generateReunions(lenghts.reunions)
const enchiridions: Array<Enchiridion> = generateEnchiridions(unities, lenghts.enchiridions)
const treatments: Array<Treatment> = generateTreatments(unities, lenghts.treatments)
const foodBaskets: Array<FoodBasket> = generateFoodBaskets(lenghts.foodBasket)
const dropboxBackups: Array<DropboxBackup> = generateDropboxBackup(lenghts.dropboxBackup)

const mockDataService = {
  // GET /reunions
  getReunions: (): Array<Reunion> => {
    return reunions
  },

  // GET /reunions/:id
  getReunionById: (id: number): Array<Reunion> => {
    return reunions.filter((reunion) => reunion.id === id)
  },

  // GET /reunions/treatments
  getReunionTreatments: (id: number) => {
    return treatments.filter((treatment) => treatment.reunionId === id)
  },

  // GET /unities
  getUnities: (): Array<Unity> => {
    return unities
  },

  // GET /unities/:id
  getUnityById: (id: number): Array<Unity> => {
    return unities.filter((unity) => unity.id === id)
  },

  // GET /enchiridions
  getEnchiridions: (): Array<Enchiridion> => {
    return enchiridions
  },

  // GET /enchiridions/:id
  getEnchiridionById: (id: number): Array<Enchiridion> => {
    return enchiridions.filter((enchiridion) => enchiridion.id === id)
  },

  // GET /treatments
  getTreatment: (): Array<Treatment> => {
    return treatments
  },

  // GET /treatments/:id
  getTreatmentById: (id: number): Array<Treatment> => {
    return treatments.filter((treatment) => treatment.id === id)
  },

  // GET /treatments/repeated
  getTreatmentRepeated: (EnchiridionId: number) => {
    const lastMonth = new Date().getMonth().toString().padStart(2, '0')
    const regex = new RegExp(`\\/(${lastMonth}+)\\/`)

    return treatments.filter(
      (treatment) => treatment.enchiridionId === EnchiridionId && treatment.date.match(regex)
    )
  },

  // GET /foodBaskets
  getFoodBaskets: (): Array<FoodBasket> => {
    return foodBaskets
  },

  // GET /foodBaskets/:id
  getFoodBasketById: (id: number): Array<FoodBasket> => {
    return foodBaskets.filter((foodBasket) => foodBasket.id === id)
  },

  // GET /dropboxBackup
  getDropboxBackups: (): Array<DropboxBackup> => {
    return dropboxBackups
  },

  // GET /foodBaskets/:id
  getDropboxBackupById: (id: number): Array<DropboxBackup> => {
    return dropboxBackups.filter((dropboxBackup) => dropboxBackup.id === id)
  }
}

export default mockDataService
