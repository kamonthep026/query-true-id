const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const fs = require('fs')
const writeFile = require('util').promisify(fs.writeFile)

const { log, errorLog } = require('./models/log.model')
const { findUsers } = require('./models/user.model')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
)

let complete = 0
let i = 0
let newData = []

function comparingValues(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].publicId == data[i].displayName) {
            newData.push(data[i])
        }
    }
}

async function saveToFile(skip, limit) {
    const myPromise = new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                let data = await findUsers(
                    {
                        networkId: mongoose.mongo.ObjectId('5a963b859b3f120011724809'),
                        updatedAt: { $gte: new Date('2022-01-01T00:00:00Z') },
                    },
                    skip,
                    limit
                )
                comparingValues(data)
                // log(`🚀 ~ file: app.js ~ line 149 ~ .then ~ res \n${data}`)

                if (newData.length != 0 && newData.length >= 2) {
                    writeFile(`./json/${Date.now()}_TrueId_${i + 1}.json`, JSON.stringify(newData), function (err) {
                        if (err) {
                            reject(err)
                        } else {
                            log('Write complete')
                            resolve()
                        }
                    })
                    newData = []
                    i++
                }

                if (data.length == 0) {
                    complete = 1
                }
            } catch (err) {
                console.log(`error msg ${err}`)
            }
            resolve('ok')
        }, 1000)
    })

    return myPromise
}

app.post('/users', async (req, res) => {
    if (req.method == 'POST') {
        let body = req.body
        let messageError = {}

        if (typeof body.skip != 'number') messageError['skip'] = ['Invalid skip']
        if (typeof body.limit != 'number') messageError['skip'] = ['Invalid limit']

        if (Object.keys(messageError).length >= 1) {
            res.status(400).json({
                status: 400,
                errors: messageError,
            })
        } else {
            try {
                let skip = body.skip ? body.skip : 0
                let limit = body.limit ? body.limit : 5000

                do {
                    log(`amount ${skip + limit}, file ${i}, newData ${newData.length}`)
                    console.time('answer time')
                    await saveToFile(skip, limit)
                    console.timeEnd('answer time')
                    skip += limit
                } while (complete !== 1)

                res.status(200).json({
                    status: 200,
                    message: 'ok',
                })
            } catch (error) {
                errorLog(error)
                res.status(400).json({
                    status: 400,
                    message: error,
                })
            }
        }
    }
})

app.use((req, res, next) => {
    const error = new Error('Not found')
    res.status(404)
    next(error)
})

app.use((error, req, res) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message,
        },
    })
})
module.exports = app
