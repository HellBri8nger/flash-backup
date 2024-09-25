import fs from "fs";
const sqlite3 = require('sqlite3').verbose()

let db

export function createDatabase(path){
  if (!fs.existsSync(path)){
    fs.writeFileSync(path, '', {flag: 'w'})
  }
  db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.log(err)
  })
  db.run(`CREATE TABLE IF NOT EXISTS users(id integer PRIMARY KEY, name, path, command, UNIQUE(name))`)
}

export function getData(column, value){
  db.all(`SELECT * FROM users WHERE ${column} = ?`, [value], (err, rows) => {
    if (err){
      console.log(err)
      return {error: err, rows: rows, http_code: err.errno}
    }else{
      return {error: err, rows: rows, http_code: 200}
    }
  })
}

export function setData(...args){
  const table_name = args[0]
  const insert_location = args[1]
  const values = args[2]

  db.run(`INSERT INTO ${table_name}(${insert_location}) VALUES(${values})`, [], (err) => {
    if (err){
      console.log(err)
      return {error: err, http_code: err.errno}
    }else{
      return {error: err, http_code: 200}
    }
  })
}

export function removeData(column, value){
  db.run(`DELETE FROM users WHERE ${column} = ?`, [value], (err) => {
    if (err){
      console.log(err)
      return {error: err, http_code: err.errno}
    }else{
      return {error: err, http_code: 200}
    }
  })
}

export function updateData(){
  // TODO add functionality to this function
}

export function removeAllData(){
  db.run(`DROP TABLE IF EXISTS users`, [], (err) => {
    if (err){
      console.log('y')
      return {error:err, http_code: err.errno}
    }
  })

  db.run(`CREATE TABLE IF NOT EXISTS users(id integer PRIMARY KEY, name, path, command, UNIQUE(name))`, [], (err) => {
    if (err){
      console.log('y')
      return {error:err, http_code: err.errno}
    }
  })

  return {error: null, http_code: 200}

}
