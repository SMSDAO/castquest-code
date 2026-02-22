import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.WEB_UI_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// System stats
app.get('/api/stats', (req, res) => {
  res.json({
    codeAnalyzed: 1234,
    testsPassed: 98.5,
    activeWorkflows: 24,
    deployments: 156,
  })
})

// Recent activity
app.get('/api/activity', (req, res) => {
  res.json([
    {
      type: 'analysis',
      title: 'Code Analysis Completed',
      description: 'Analyzed 45 files',
      timestamp: new Date(Date.now() - 120000).toISOString(),
    },
    {
      type: 'test',
      title: 'Test Suite Running',
      description: 'Running 31 tests',
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
  ])
})

// Code analysis endpoint
app.post('/api/analyze', async (req, res) => {
  const { path } = req.body
  
  // Emit real-time update
  io.emit('orchestration-update', {
    type: 'analysis',
    status: 'running',
    message: `Analyzing code at ${path}`,
  })

  // Simulate analysis
  setTimeout(() => {
    io.emit('orchestration-update', {
      type: 'analysis',
      status: 'completed',
      message: 'Code analysis completed',
    })
  }, 2000)

  res.json({
    success: true,
    message: 'Analysis started',
    id: `analysis-${Date.now()}`,
  })
})

// Run orchestrator
app.post('/api/orchestrate', async (req, res) => {
  const { mode, target } = req.body

  io.emit('orchestration-update', {
    type: 'orchestration',
    status: 'running',
    mode,
    target,
    message: `Starting orchestration in ${mode} mode`,
  })

  res.json({
    success: true,
    message: 'Orchestration started',
    id: `orch-${Date.now()}`,
  })
})

// Deploy endpoint
app.post('/api/deploy', async (req, res) => {
  const { platform, environment } = req.body

  io.emit('orchestration-update', {
    type: 'deployment',
    status: 'running',
    platform,
    environment,
    message: `Deploying to ${platform} (${environment})`,
  })

  res.json({
    success: true,
    message: 'Deployment started',
    id: `deploy-${Date.now()}`,
  })
})

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`🚀 AiCode API server running on port ${PORT}`)
  console.log(`📡 WebSocket server ready`)
  console.log(`🌐 Web UI: ${process.env.WEB_UI_URL || 'http://localhost:3000'}`)
})
