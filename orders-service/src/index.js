import server from './server.js'
import orderRouter from './routers/orderRouter.js'
import consume from './consume.js'

// Create a server to handle orders
server().use('/orders', orderRouter)

// Handle messages for topics: allocate_beer and allocate_drone
consume()
