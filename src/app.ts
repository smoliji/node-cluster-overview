import { IncomingMessage, ServerResponse } from 'http'
import jwt from 'jsonwebtoken'
import { Database } from './database'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export async function onRequest(req: IncomingMessage, res: ServerResponse, db: Database) {
  try {
    jwt.decode(token)
    db.query(`insert into requests (t) values ('${new Date().toISOString().replace('T', ' ').slice(0, -5)}')`)
    db.query('select count(1) from requests')
    const result = await db.query('select * from requests limit 1000')
    res.writeHead(200);
    res.end(JSON.stringify(result))
  } catch {
    res.statusCode = 500
    res.end()
  }
}
