const { Pool, Client } = require('pg')
const connectionString = 'postgressql://postgres:Praveen@123@localhost:8000/mydb'

const client = new Client({
    connectionString: connectionString
})

client.connect()
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'Praveen@123',
//   port: 8000
// })

// client.query('SELECT * from users', (err, res) => {
//     console.log(err, res)
//     client.end()
// })

module.exports = client