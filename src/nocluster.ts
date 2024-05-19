import http from 'node:http'
import { onRequest } from './app'
import { createPostgresDatabase } from './database'

const db = createPostgresDatabase()
http
  .createServer((req, res) => {
    console.log(`${process.pid} Incoming HTTP`)
    onRequest(req, res, db)
  })
  .listen(3000)
