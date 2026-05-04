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
    cors: { origin: ['http://localhost:3000',
       'https://transyncph.vercel.app'],
        methods: ['GET', 'POST'] },
  })

  // Track active buses in memory so late-joining commuters see current state
  const activeBuses = new Map<string, LocationPayload>()
  
  const lastUpdateMap = new Map<string, number>() // For throttling updates per schedule
  const THROTTLE_MS = 1000 // 1 update per second per bus

  io.on('connection', (socket) => {
    // Send current active buses to newly connected commuters
    socket.emit('bus:snapshot', Array.from(activeBuses.values()))

    // Driver: start broadcasting for a schedule
   socket.on('driver:location', (data: LocationPayload) => {
  const now = Date.now()
  const last = lastUpdateMap.get(data.scheduleId) || 0

  //  throttle spam
  if (now - last < THROTTLE_MS) return

  lastUpdateMap.set(data.scheduleId, now)

  // basic validation (important even for demo)
  if (
    !data.scheduleId ||
    typeof data.lat !== 'number' ||
    typeof data.lng !== 'number'
  ) return

  activeBuses.set(data.scheduleId, data)
  io.emit('bus:location', data)
})


    // Driver: trip ended
    socket.on('driver:end', (scheduleId: string) => {
      activeBuses.delete(scheduleId)
      io.emit('bus:removed', scheduleId)
    })

  })

  const port = parseInt(process.env.PORT || '4000', 10)
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})