import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'

const dev  = process.env.NODE_ENV !== 'production'
const app  = next({ dev })
const handle = app.getRequestHandler()

interface LocationPayload {
  scheduleId: string
  lat: number
  lng: number
  vehicleNumber?: string
  routeNumber?: string
  companyName?: string
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  })

  // Track active buses in memory so late-joining commuters see current state
  const activeBuses = new Map<string, LocationPayload>()

  io.on('connection', (socket) => {
    // Send current active buses to newly connected commuters
    socket.emit('bus:snapshot', Array.from(activeBuses.values()))

    // Driver: start broadcasting for a schedule
    socket.on('driver:location', (data: LocationPayload) => {
      activeBuses.set(data.scheduleId, data)
      io.emit('bus:location', data)          // broadcast to all commuters
    })

    // Driver: trip ended
    socket.on('driver:end', (scheduleId: string) => {
      activeBuses.delete(scheduleId)
      io.emit('bus:removed', scheduleId)
    })

    socket.on('disconnect', () => {
      // Can't tell who was a driver here without auth, fine for MVP
    })
  })

  const port = parseInt(process.env.PORT || '3000', 10)
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})