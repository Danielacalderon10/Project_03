
//initialise and conect
const pgp = require('pg-promise')()

const username = 'postgres'
const password = 'Dany.10'
const host = 'localhost'
const port = '5432'
const database = 'schedules'

const connectionString = `postgres://${username}:${password}@${host}:${port}/${database}`

// create db instance
const db = pgp(connectionString)

module.exports = db


