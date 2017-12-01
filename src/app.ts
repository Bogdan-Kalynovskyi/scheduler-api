import * as express from 'express'
import * as session from 'express-session'
import * as http from 'http'
import * as bodyParser from "body-parser"
import * as cors from "cors"
import csurf = require('csurf')
import errorhandler = require("errorhandler")
import morgan = require("morgan")
import mongoose = require('mongoose')
mongoose.Promise = Promise
const MongoStore = require('connect-mongo')(session)

import {authRoutes} from "./routes/auth.routes"
import {userRoutes} from "./routes/user.routes"
import {monthRoutes} from "./routes/month.routes"
import {adminEmails, sessionSecret} from "./config/config";
import {UserDb} from './models/user.model'
import {Auth} from "./models/auth.model";

const port = process.env.PORT || 3333
const mongoUrl = process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/test'


mongoose.connect( mongoUrl, { useMongoClient: true })
mongoose.connection.on('error',(err) => console.log('Error when connecting to mongodb'))
mongoose.connection.on('connected',() => {
  console.log('Connected to mongodb :)')

  UserDb.remove({}).then(() => {
    adminEmails.forEach((email, i) => {
      const user = new UserDb({
        email: email,
        googleId: i
      })
      user.save()
      console.log(email + ' added as a user')
    })
  });
})


const app = express()
const server = http.createServer(app)

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(session({
  // ttl:
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(morgan(':method :url :status'))
// if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler()) // this guy sucks
// }

app.get('/ping', (req, res) => {
  res.send('pong')
})
app.use( '/', authRoutes )
app.use(csurf({ignoreMethods: ['HEAD', 'OPTIONS']}))
app.use( '/', monthRoutes )
app.use([Auth.isAdmin])
app.use( '/', userRoutes )

// error handling
let expressNext;
app.use(function(error, request, response, next) {
  expressNext = next
  console.error(error)
  
  response.status(error.status || 500).send(error.message || JSON.stringify(error))
})


process.on('unhandledRejection', function(error, p) {
  expressNext(error)
});

process.on('unhandledException', function(error, p) {
  expressNext(error)
});


server.listen(port, () => {
  console.log(`app listening on port ${port}`)
})