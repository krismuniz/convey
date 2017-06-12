import pg from 'pg-promise'

const db = pg()(process.env.DATABASE_URL)

export default db
