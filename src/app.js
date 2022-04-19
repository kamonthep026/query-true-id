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
let amount = 0
let newData = []

function comparingValues(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].publicId == data[i].displayName) {
            newData.push(data[i])
        }
    }
}

async function saveToFile(amount) {
    const myPromise = new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                let data = await findUsers(
                    {
                        networkId: mongoose.mongo.ObjectId('5a963b859b3f120011724809'),
                        displayName: { $ne: 'Anonymous' },
                    },
                    amount,
                    5000,
                    { updatedAt: -1 }
                )
                comparingValues(data)
                // console.log(typeof dataComparing)
                // console.log(dataComparing)
                // log(`🚀 ~ file: app.js ~ line 149 ~ .then ~ res \n${data}`)

                if (newData.length > 0 && newData.length >= 5000) {
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

app.get('/data-to-json', async (req, res) => {
    try {
        do {
            log(`amount ${amount + 5000}, file ${i}, newData ${newData.length}`)
            console.time('answer time')
            await saveToFile(amount)
            console.timeEnd('answer time')
            amount += 5000
        } while (complete !== 1)

        res.status(200).json({
            status: 200,
            // length: total,
            message: 'ok',
        })
    } catch (error) {
        errorLog(error)
        res.status(400).json({
            status: 400,
            message: error,
        })
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
