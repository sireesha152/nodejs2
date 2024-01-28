const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
app.use(express.json())

let dbpath = path.join(__dirname, 'cricketTeam.db')
let db = null
const inistializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running')
    })
  } catch (e) {
    console.log('Database Error in ${e.message}')
    process.exit(1)
  }
}
inistializeDBandServer()

app.get('/players/', async (request, response) => {
  const query = `
    SELECT player_name from cricket_team`
  let playerslist = await db.all(query)
  response.send(playerslist)
})

app.post('/players/', async (request, response) => {
  const details = request.body
  const {player_name, jersey_number, role} = details
  let insertedquery = `
    INSERT INTO cricket_team(player_name,jersey_number,role)
    VALUES ('${player_name}',${jersey_number},'${role}')`
  await db.run(insertedquery)

  response.send('Player Added to Team')
})

app.get('/players/:player_id/', async (request, response) => {
  let query = `
    SELECT player_name from cricket_team WHERE player_id=1`
  let player = await db.get(query)
  response.send(player)
})

app.put('/players/:player_id/', async (request, response) => {
  const {player_id} = request.params
  const playerdetails = request.body
  const {player_name, jersey_number, role} = playerdetails
  let updatedquery = `
    UPDATE cricket_team
    SET 'player_name'='${player_name}','jersey_number'=${jersey_number},'role'='${role}' WHERE player_id=${player_id}`
  await db.run(updatedquery)
  response.send('Player Details Updated')
})

app.delete('/players/:player_id/', async (request, response) => {
  const {player_id} = request.params
  const query = `DELETE FROM cricket_team WHERE player_id=${player_id}`
  await db.run(query)
  response.send('Player Removed')
})

module.exports = app
