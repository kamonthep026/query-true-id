const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const fs = require('fs')
const writeFile = require('util').promisify(fs.writeFile)
const jsonfile = require('jsonfile')

const { log, errorLog } = require('./models/log.model')
const { findUsers, estimatedDocumentCountUsers } = require('./models/user.model')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
)

async function saveToFile(amount, i) {
    const myPromise = new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                let data = await findUsers(
                    {
                        $expr: {
                            $and: [
                                { networkId: mongoose.mongo.ObjectId('5a963b859b3f120011724809') },
                                {
                                    $eq: ['$publicId', '$displayName'],
                                },
                            ],
                        },
                    },
                    amount,
                    1000
                )
                // log(`🚀 ~ file: app.js ~ line 149 ~ .then ~ res \n${data}`)
                writeFile(`./json/${Date.now()}_TrueId_${j}.json`, JSON.stringify(data), function (err) {
                    if (err) {
                        reject(err)
                    } else {
                        log('Write complete')
                        resolve()
                    }
                })
            } catch (err) {
                console.log(`error msg ${err}`)
            }
            resolve('ok')
        }, 1000 * i)
    })

    return myPromise
}

app.get('/data-to-json', async (req, res) => {
    let i = 1
    let amount = 0

    try {
        const total = await estimatedDocumentCountUsers({
            $expr: {
                $and: [
                    { networkId: mongoose.mongo.ObjectId('5a963b859b3f120011724809') },
                    {
                        $eq: ['$publicId', '$displayName'],
                    },
                ],
            },
        })

        do {
            log(`skip ${i}, file ${i}`)
            // console.time('answer time')
            await saveToFile(amount, i)
            // console.timeEnd('answer time')
            amount += 1000
            i++
        } while (amount <= parseInt(total))

        res.status(200).json({
            status: 200,
            length: total,
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
