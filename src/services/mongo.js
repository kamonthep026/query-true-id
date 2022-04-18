const mongoose = require('mongoose')

// Update below to match your own MongoDB connection string.
const MONGO_URL = 'mongodb://localhost:27028/eko-messaging'

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect() {
    await mongoose.connect(MONGO_URL)
}

module.exports = {
    mongoConnect,
}