import fs from 'fs'
import path from 'path'

const TABLES_DIR = './app/server/database/sql'

const readSQLFile = (fileName, callback) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(TABLES_DIR, fileName), 'utf8', (err, file) => {
      if (err) reject(err)
      resolve(file)
    })
  })
}

module.exports = async (db) => {
  const logErr = e => console.log(e)

  const schemaFile = await readSQLFile('schema.sql').catch(logErr)
  const testDataFile = await readSQLFile('placeholder_data.sql').catch(logErr)

  db.query(schemaFile)
    .then(r => {
      console.log('Schema built')

      db.query(testDataFile)
        .then(r => console.log('Test data inserted'))
        .catch(logErr)
    })
    .catch(logErr)
}
