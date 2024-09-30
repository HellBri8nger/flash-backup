import fs from "fs"
const sqlite3 = require('sqlite3').verbose()

let db

export function createDatabase(path){
  if (!fs.existsSync(path)){
    fs.writeFileSync(path, '', {flag: 'w'})
  }
  db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE)
  db.run(`CREATE TABLE IF NOT EXISTS users(id integer PRIMARY KEY, name, path, command, UNIQUE(name))`)
  // setData("users", '"name","path","command"', '"test", "new", "path"')
}

export function getData(column, value){
  return new Promise((resolve) => {
    db.all(`SELECT * FROM users WHERE ${column} = ?`, [value], (err, rows) => {
      if (err){
          resolve({error: err, rows: rows, http_code: err.errno})
      }else{
        resolve({error: err, rows: rows, http_code: 200})
      }
    })
  })
}

export function getAllData(table){
  return new Promise((resolve) => {
    db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      if (err){
        resolve({error: err, rows: rows, http_code: err.errno})
      }else{
        resolve({error: err, rows: rows, http_code: 200})
      }
    })
  })
}


export function setData(...args) {
  /* This function takes 3 arguments
  1. name of the table
  2. the columns you want to insert data into
  3. the values
  for the columns and values you can pass in as many arguments as you want surround each one with double quotes and surround the whole argument with either backticks or single quotes
  */

  const table_name = args[0];
  const insert_location = args[1];
  const values = args[2];

  return new Promise((resolve) => {
    db.run(`INSERT INTO ${table_name}(${insert_location}) VALUES(${values})`, [], (err) => {
      if (err) {
        resolve({ error: err, http_code: err.errno });
      } else {
        resolve({ error: null, http_code: 200 });
      }
    });
  });
}


export function removeData(column, value){
  return new Promise((resolve) => {
    db.run(`DELETE FROM users WHERE ${column} = ?`, [value], (err) => {
      if (err){
        resolve({error: err, http_code: err.errno})
      }else{
        resolve({error: err, http_code: 200})
      }
    })
  })
}

export function updateData(...args){
  const table_name = args[1]
  const new_values = args[2]
  const id = args[3]

  return new Promise((resolve) => {
    db.run(`UPDATE ${table_name} SET ${new_values} WHERE id = ?`, [id], (err) => {
      if (err){
        resolve({error: err, http_code: err.errno})
      }else{
        resolve({error: null, http_code: 200})
      }
  })
  })
}

export function removeAllData(){
  db.run(`DROP TABLE IF EXISTS users`, [], (err) => {
    if (err){
      return {error:err, http_code: err.errno}
    }
  })

  db.run(`CREATE TABLE IF NOT EXISTS users(id integer PRIMARY KEY, name, path, command, UNIQUE(name))`, [], (err) => {
    if (err){
      return {error:err, http_code: err.errno}
    }
  })

  return {error: null, http_code: 200}

}
