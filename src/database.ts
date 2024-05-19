import pg from 'pg'

export interface Database {
  query: (q: string) => Promise<{ rows: unknown[] }>
}

export function createPostgresDatabase(): Database {
  const pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    min: 1,
    max: 10,
    user: 'postgres',
    password: 'example',
  })

  const client = pool.connect()

  pool.on('connect', () => console.log(`${process.pid} Database connected`))

  process.on('beforeExit', () => {
    console.log(`${process.pid} Database closing`)
    pool.end()
  })
  return {
    async query(q: string) {
      const response = await (await client).query(q)
      return {
        rows: response.rows,
      }
    },
  }
}
