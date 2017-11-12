import express from 'express'
import http from 'http';
import cors from 'cors';
import bodyParser from  'body-parser'
import mongoose from 'mongoose'

let port = process.env.PORT || 3000
const mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test' || process.env.MONGODB_URI;

mongoose.connect( mongoUrl )
mongoose.connection.on('open',() => console.log("Connected successfully to mongo"));

let app = express()
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