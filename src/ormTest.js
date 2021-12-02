const express = require('express')
const http = require('http')
const path = require('path')

const bodyParser = require('body-parser')
const cors = require('./modules/cors')
const db = require('./modules/db')

const countryOrm = require('./modules/orm/models/country');

let Country = countryOrm.Country;
// let routes = require('./routes/index');
// let users = require('./routes/users');

async function main () {
  const app = express()
  const server = http.createServer(app)
  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(express.json())
  app.use(cors)
  app.set('json spaces', 2)
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './layout/index.html'))
  })
  app.get('/API', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.json({
      title: 'Bolt Node.JS API server',
      develop: process.env.NODE_ENV,
      compress: process.env.COMPRESS,
      debug: { mysql: process.env.MYSQL_DEBUG },
      log: {
        events: process.env.CONSOLE_EVENT,
        errors: process.env.CONSOLE_ERROR
      }
    })
  })
  app.get('/ormTest', (req, res) => {    
    let slovenia = new Country();
    slovenia.setName("Slovenia");
    slovenia.setCallingCode("+386");
    slovenia.create();

    res.send(slovenia);
  });
  // app.use('/API/', getIndex)
  // app.use('/API/getUsers', getUsers)
  app.use(async function (err, req, res, next) {
    try {
      let resObj = { error: 'generic' }
      if (err.message !== undefined) {
        resObj = { error: err.message }
      }
      console.log(err.stack)
      res.status(err.exitCode).send(resObj)
    } catch (err) {
      console.error(err.stack)
    }
  })
  const PORT = process.env.PORT || 3001
  const HOST = process.env.HOST || '127.0.0.1'
  server.listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}...`))
}
main()
