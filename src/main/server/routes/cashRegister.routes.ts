import { Router } from 'express'
import { getCashRegisterByReunion } from '../../database/cashRegisterRepository'
import { getTicketsByReunion } from '../../database/cashTicketRepository'
import { getExpensesByReunion } from '../../database/cashExpenseRepository'

export const cashRegisterRouter = Router()

cashRegisterRouter.get('/register/reunion/:reunionId', (req, res) => {
  try {
    res.json(getCashRegisterByReunion(Number(req.params.reunionId)))
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

cashRegisterRouter.get('/tickets/reunion/:reunionId', (req, res) => {
  try {
    res.json(getTicketsByReunion(Number(req.params.reunionId)))
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

cashRegisterRouter.get('/expenses/reunion/:reunionId', (req, res) => {
  try {
    res.json(getExpensesByReunion(Number(req.params.reunionId)))
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})
