const express = require('express')
const path = require('path')
const cors = require('cors')


const routes = require('./routes')

const app = express()
app.use(cors())

app.set('port', 3000)

// middleware sits between req and res
app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)

const server = app.listen(app.get('port'), () => {
  const port = server.address().port
  console.log('listening on port ' + port)
})