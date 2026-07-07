import { Router } from 'express'
import { getAllReunions, getReunionById } from '../../database/reunionRepository'

export const reunionRouter = Router()

reunionRouter.get('/', (_req, res) => {
  try {
    const { startDate, endDate, status } = _req.query as Record<string, string>
    const data = getAllReunions({ startDate, endDate, status })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

reunionRouter.get('/:id', (req, res) => {
  try {
    const data = getReunionById(Number(req.params.id))
    if (!data) return res.status(404).json({ error: 'Not found' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})
