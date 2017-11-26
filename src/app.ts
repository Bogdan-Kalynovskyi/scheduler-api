import * as express from 'express'
import * as session from 'express-session'
import * as http from 'http'
import mongoose = require('mongoose')
mongoose.Promise = Promise
import * as bodyParser from "body-parser"
import * as cors from "cors"
import morgan = require("morgan");

import {authRoutes, sessionAuth} from "./routes/authRoutes"
import {userRoutes} from "./routes/userRoutes"
import {monthRoutes} from "./routes/monthRoutes"
import {adminEmails, sessionSecret} from "./config/config";
import {UserModel} from './models/userModel'

const port = process.env.PORT || 3333
const mongoUrl = process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/test'


mongoose.connect( mongoUrl, { useMongoClient: true })
mongoose.connection.on('error',(err) => console.log('Error when connecting to mongodb'))
mongoose.connection.on('connected',() => {
  console.log('Connected to mongodb :)')

  UserModel.remove({}).then(() => {
    adminEmails.forEach((email) => {
      const user = new UserModel({email})
      user.save()
      console.log(email + ' added as a user')
    })
  });
})


const app = express()
const server = http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}))
app.use(morgan(':method :url :status'))

app.get('/ping', (req, res) => {
  res.send('pong')
})
app.use( '/', authRoutes )
app.all( '/*', [sessionAuth] )
app.use( '/', userRoutes )
app.use( '/', monthRoutes )

// error handling
app.use(function(error, request, response, next) {
  if (error.stack) {
    console.error(error.stack)
  }
  response.status(error.status || 500).send(error.message || 'unhandled')
  next(error)
})


server.listen(port, () => {
  console.log(`app listening on port ${port}`)
})