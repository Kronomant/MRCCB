import { Router } from 'express'
import {
  getAllAtendimentos,
  getAtendimentosByReunion,
  getAtendimentosByProntuario,
  getAtendimentoById
} from '../../database/atendimentoRepository'

export const atendimentoRouter = Router()

atendimentoRouter.get('/', (_req, res) => {
  try {
    res.json(getAllAtendimentos())
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

atendimentoRouter.get('/reunion/:reunionId', (req, res) => {
  try {
    res.json(getAtendimentosByReunion(Number(req.params.reunionId)))
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

atendimentoRouter.get('/prontuario/:prontuarioId', (req, res) => {
  try {
    res.json(getAtendimentosByProntuario(Number(req.params.prontuarioId)))
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

atendimentoRouter.get('/:id', (req, res) => {
  try {
    const data = getAtendimentoById(Number(req.params.id))
    if (!data) return res.status(404).json({ error: 'Not found' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})
