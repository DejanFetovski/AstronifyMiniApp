import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'

require('dotenv').config()

import routeAuth from './routes/auth.routes'
import routeUser from './routes/user.routes'
import routerAstronology from './routes/astronology.routes'
import routeGPT from './routes/chatgpt.route'
import routeTask from './routes/task.routes'

import { appInit } from './core/tapgame'
// import { startWebSocketServer } from './socket'

// import https from "https";
import http from "http";
// import { Socket } from 'socket.io'

export const run = async (bot: any): Promise<void> => {
  const app: Express = express()

  app.use(cors())

  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization'
    )
    next()
  })

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/api/auth', routeAuth)
  app.use('/api/user', routeUser)
  app.use('/api/astronology', routerAstronology)
  app.use('/api/chatgpt', routeGPT)
  app.use('/api/task', routeTask)

  const port = process.env.PORT

  // Read the SSL certificate and key files
  // const sslOptions = {
  //   key: fs.readFileSync(process.env.SSL_KEY_PATH || 'server.key'),
  //   cert: fs.readFileSync(process.env.SSL_CERT_PATH || 'server.cert'),
  // }
  // let server = https.createServer(sslOptions, app);

  let server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server up and running on port ${port} with HTTPS!`)
  })

  // Start socket server 
  // startWebSocketServer(server,
  //   async (socket: Socket) => {
  //     socket.emit("Hello", JSON.stringify({ message: "OK" }))
  //   }),
  //   async (userId: string) => { }

  // Schedule the task to run every day at 00:00 UTC (midnight)
  appInit();
}
