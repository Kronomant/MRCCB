import express from 'express'
import { createServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import cors from 'cors'
import { join } from 'path'
import { networkInterfaces } from 'os'
import { is } from '@electron-toolkit/utils'
import { reunionRouter } from './routes/reunion.routes'
import { atendimentoRouter } from './routes/atendimento.routes'
import { prontuarioRouter } from './routes/prontuario.routes'
import { unityRouter } from './routes/unity.routes'
import { deliveryRouter } from './routes/delivery.routes'
import { cashRegisterRouter } from './routes/cashRegister.routes'

const PORT = 3456

const expressApp = express()
const httpServer = createServer(expressApp)
const wss = new WebSocketServer({ server: httpServer, path: '/ws' })

expressApp.use(cors())
expressApp.use(express.json())

expressApp.use('/api/reunions', reunionRouter)
expressApp.use('/api/atendimentos', atendimentoRouter)
expressApp.use('/api/prontuarios', prontuarioRouter)
expressApp.use('/api/unities', unityRouter)
expressApp.use('/api/deliveries', deliveryRouter)
expressApp.use('/api/cash', cashRegisterRouter)

// In dev: serve from out/pwa (built once with npm run pwa:build)
// In prod: serve from resources/pwa (via extraResources in electron-builder.yml, outside asar)
const pwaPath = is.dev
  ? join(process.cwd(), 'out/pwa')
  : join(process.resourcesPath, 'pwa')

expressApp.use(express.static(pwaPath))
expressApp.get(/(.*)/, (_req, res) => {
  res.sendFile(join(pwaPath, 'index.html'))
})

export function broadcast(data: { entity: string }) {
  const message = JSON.stringify(data)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

export function getLocalIp(): string {
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return 'localhost'
}

export function getServerUrl(): string {
  return `http://${getLocalIp()}:${PORT}`
}

export function startHttpServer(): void {
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[HTTP Server] Running at ${getServerUrl()}`)
  })
}
