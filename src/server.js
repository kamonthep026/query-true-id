const http = require('http')
const mongoose = require('mongoose')

const app = require('./app.js')
const { log } = require('./models/log.model')

const PORT = process.env.PORT || 8000
const MONGODB_URI = 'mongodb://localhost:27028/eko-messaging'

const server = http.createServer(app)
//Get the default connection
const connection = mongoose.connection

connection.once('open', () => {
    log('MongoDB connection ready!')
})

//Bind connection to error event (to get notification of connection errors)
connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

mongoose.connect(MONGODB_URI)

server.timeout = 0

server.listen(PORT, () => {
    log(`Example app listening at http://localhost:${PORT}`)
})
