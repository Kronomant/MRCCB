import { Router } from 'express'
import {
  getProntuarioDeliveriesByReunion,
  getProntuarioDeliveriesByProntuario,
  getStatusTransitionLogs
} from '../../database/prontuarioDeliveryRepository'

export const deliveryRouter = Router()

deliveryRouter.get('/reunion/:reunionId', (req, res) => {
  try {
    res.json(getProntuarioDeliveriesByReunion(Number(req.params.reunionId)))
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

deliveryRouter.get('/prontuario/:prontuarioId', (req, res) => {
  try {
    res.json(getProntuarioDeliveriesByProntuario(Number(req.params.prontuarioId)))
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

deliveryRouter.get('/logs/:entityType/:entityId', (req, res) => {
  try {
    const entityType = req.params.entityType as 'reunion' | 'prontuario_delivery'
    res.json(getStatusTransitionLogs(entityType, Number(req.params.entityId)))
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})
