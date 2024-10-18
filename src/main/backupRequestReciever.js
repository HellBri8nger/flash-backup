const express = require('express')
const app = express()
const port = 14004

export default function receiver(){
  app.use(express.urlencoded({extended: true}))

  app.post('/', (req, res) => {
    console.log(req.body)
    res.send('hi')
  })

  app.listen(port, () => {
    console.log("app listening")
  })

}

