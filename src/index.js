import express from 'express'
import http from 'http';
import cors from 'cors';
import bodyParser from  'body-parser'
import mongoose from 'mongoose'

const port = process.env.PORT || 3000
const mongoUrl = process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

mongoose.connect( mongoUrl, { useMongoClient: true })
mongoose.connection.on('error',(err) => console.log("Error when connecting to mongo"))
mongoose.connection.on('connected',() => console.log('Connection successfully established'))

console.log(process.env)

const app = express()
app.server = http.createServer(app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

app.get('/test',function(req,res) {
	res.send('Api is working corrextly')
})

app.server.listen(port, function () {
  console.log(`app listening on port ${port}`)
})