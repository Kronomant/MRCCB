import { Router } from 'express'
import {
  getAllProntuarios,
  getActiveProntuarios,
  getProntuarioById,
  getProntuarioByNumber
} from '../../database/prontuarioRepository'

export const prontuarioRouter = Router()

prontuarioRouter.get('/', (_req, res) => {
  try {
    res.json(getAllProntuarios())
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

prontuarioRouter.get('/active', (_req, res) => {
  try {
    res.json(getActiveProntuarios())
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

prontuarioRouter.get('/number/:number', (req, res) => {
  try {
    const data = getProntuarioByNumber(Number(req.params.number))
    if (!data) return res.status(404).json({ error: 'Not found' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

prontuarioRouter.get('/:id', (req, res) => {
  try {
    const data = getProntuarioById(Number(req.params.id))
    if (!data) return res.status(404).json({ error: 'Not found' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})
