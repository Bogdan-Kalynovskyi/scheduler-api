import express from 'express'
import http from 'http';
import cors from 'cors';
import bodyParser from  'body-parser'
import mongoose from 'mongoose'

import { jwtAuth,createToken } from './jwt'
import { authRoutes } from './routes/authRoutes'

const port = process.env.PORT || 3000
const mongoUrl = process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

mongoose.Promise = global.Promise;
mongoose.connect( mongoUrl, { useMongoClient: true })
mongoose.connection.on('error',(err) => console.log("Error when connecting to mongo"))
mongoose.connection.on('connected',() => console.log('Connection successfully established'))

const app = express()
app.server = http.createServer(app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

app.get('/test',function(req,res) {
	res.send('Api is working corrextly')
})
app.use('/',authRoutes)

app.all('/*',[jwtAuth])

app.get('/test-protected',(req,res) => {
  res.status(200).json({
    message:'Protected API is working good'
  })
})

app.server.listen(port, function () {
  console.log(`app listening on port ${port}`)
})