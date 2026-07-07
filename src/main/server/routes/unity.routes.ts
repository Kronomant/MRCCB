import { Router } from 'express'
import { getAllUnities, getUnityById } from '../../database/unityRepository'

export const unityRouter = Router()

unityRouter.get('/', (_req, res) => {
  try {
    res.json(getAllUnities())
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

unityRouter.get('/:id', (req, res) => {
  try {
    const data = getUnityById(Number(req.params.id))
    if (!data) return res.status(404).json({ error: 'Not found' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})
