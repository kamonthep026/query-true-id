const http = require('http')

const app = require('./app.js')
const { log } = require('./models/log.model')
const { mongoConnect } = require('./services/mongo')

const PORT = 8000

const server = http.createServer(app)

async function startServer() {
    await mongoConnect()

    server.listen(PORT, () => {
        log(`Example app listening at http://localhost:${PORT}`)
    })
}

startServer()
