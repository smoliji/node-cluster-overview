/*
💡
 
 */
import cluster from 'node:cluster'
import http from 'node:http'
import { availableParallelism } from 'node:os'
import process from 'node:process'
import { onRequest } from './app'
import { createPostgresDatabase } from './database'

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`)
  console.log(`Parallelism ${availableParallelism()}`)

  for (let i = 0; i < availableParallelism(); i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker exited (code ${worker.process.pid})`)
    cluster.fork()
  })
} else {
  const db = createPostgresDatabase()
  http
    .createServer((req, res) => {
      console.log(`${process.pid} Incoming HTTP`)
      onRequest(req, res, db)
    })
    .listen(3000)

  console.log(`Worker ${process.pid} started`)
}
