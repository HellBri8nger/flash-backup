import fs from "fs"
import { app } from 'electron'
import {join} from "path";

const sqlite3 = require('sqlite3').verbose()

let db

const createTables = () => {
  const path = join(app.getPath('appData'), "flash-backup", "backups")

  db.run(`CREATE TABLE IF NOT EXISTS itemData(id integer PRIMARY KEY, name, path, backupService, googleDriveFolderID, UNIQUE(name))`)

  db.run(`CREATE TABLE IF NOT EXISTS userSettings(id integer PRIMARY KEY, defaultService, localBackupLocation, googleDriveToken, googleDriveCredentials, googleDriveMainFolder, donationTimer, showDonationModal)`, [], () => {
    db.run(`INSERT OR IGNORE INTO userSettings (id, defaultService) VALUES(1, 'Local') ON CONFLICT(id) DO NOTHING`)
    db.run(`UPDATE userSettings SET localBackupLocation = ? WHERE id = 1 AND localBackupLocation IS NULL`, [path])
  })

  if (!fs.existsSync(path)){
    fs.mkdirSync(path)
  }

}

export function createDatabase(path){
  if (!fs.existsSync(path)){
    fs.writeFileSync(path, '', {flag: 'w'})
  }
  db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE)
  createTables()

}

export function getData(table, column, value){
  return new Promise((resolve) => {
    db.all(`SELECT * FROM ${table} WHERE ${column} = ?`, [value], (err, rows) => {
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
    db.run(`INSERT INTO ${table_name}(${insert_location}) VALUES(${values})`, [], function (err) {
      if (err) {
        resolve({ error: err, http_code: err.errno });
      } else {
        resolve({ error: null, http_code: 200 });
      }
    })
  })
}


export function removeData(table, column, value){
  return new Promise((resolve) => {
    db.run(`DELETE FROM ${table} WHERE ${column} = ?`, [value], function(err) {
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
    db.run(`UPDATE ${table_name} SET ${new_values} WHERE id = ?`, [id], function(err){
      if (err){
        resolve({error: err, http_code: err.errno})
      }else{
        resolve({error: null, http_code: 200})
      }
  })
  })
}

export function removeAllData(){
  db.run(`DROP TABLE IF EXISTS itemData`, [], (err) => {
    if (err){
      return {error:err, http_code: err.errno}
    }
  })

  createTables()
  return {error: null, http_code: 200}

}

