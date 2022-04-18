const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const fs = require('fs')
const writeFile = require('util').promisify(fs.writeFile)
const jsonfile = require('jsonfile')

const { userModel } = require('./models/user.model')
const { log, errorLog } = require('./models/log.model')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
)

async function saveToFile(i, j) {
    const myPromise = new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                let data = await userModel
                    .find({
                        $expr: {
                            $and: [
                                { networkId: mongoose.mongo.ObjectId('5a963b859b3f120011724809') },
                                {
                                    $eq: ['$publicId', '$displayName'],
                                },
                            ],
                        },
                    })
                    .limit(1000)
                    .skip(i)

                jsonfile
                    .writeFile(`./json/${Date.now()}_TrueId_${j}.json`, `m${j}`)
                    .then((res) => {
                        console.log('Write complete')
                        resolve(res)
                    })
                    .catch((error) => {
                        console.error(error)
                        reject(error)
                    })
                // console.log('🚀 ~ file: app.js ~ line 149 ~ .then ~ res', data)

                //  writeFile(`./json/${Date.now()}_TrueId_${j}.json`, JSON.stringify(res), function (err) {
                //     if (err) {
                //         reject(err)
                //     } else {
                //         log('Write complete')
                //         resolve()
                //     }
                // })
            } catch (err) {
                console.log(`error msg ${err}`)
            }
            resolve('ok')
        }, 1000 * j)
    })

    return myPromise
}

app.get('/data-to-json', async (req, res) => {
    let j = 1
    // let i = 0

    try {
        const total = await userModel.estimatedDocumentCount({
            $expr: {
                $and: [
                    { networkId: mongoose.mongo.ObjectId('5a963b859b3f120011724809') },
                    {
                        $eq: ['$publicId', '$displayName'],
                    },
                ],
            },
        })

        // do {
        //     log(`skip ${i}`)

        //     if (j == 0) {
        //         const users = await userModel
        //             .find({
        //                 $expr: {
        //                     $and: [
        //                         { networkId: mongoose.mongo.ObjectId('5a963b859b3f120011724809') },
        //                         {
        //                             $eq: ['$publicId', '$displayName'],
        //                         },
        //                     ],
        //                 },
        //             })
        //             .limit(10)

        //         await saveToFile(users, j)
        //     } else {
        //         const users = await userModel
        //             .find({
        //                 $expr: {
        //                     $and: [
        //                         { networkId: mongoose.mongo.ObjectId('5a963b859b3f120011724809') },
        //                         {
        //                             $eq: ['$publicId', '$displayName'],
        //                         },
        //                     ],
        //                 },
        //             })
        //             .limit(10)
        //             .skip(i)

        //         await saveToFile(users, j)
        //     }
        //     i += 10
        //     j++
        // } while (i <= 500)

        // for (let i = 0; i <= 100; i += 10) {
        // log(`skip ${i}, file ${j}`)
        // console.time('answer time')
        // const users = await userModel
        //     .find({
        //         $expr: {
        //             $and: [
        //                 { networkId: mongoose.mongo.ObjectId('5a963b859b3f120011724809') },
        //                 {
        //                     $eq: ['$publicId', '$displayName'],
        //                 },
        //             ],
        //         },
        //     })
        //     .limit(10)
        //     .skip(i)
        //     // log(`🚀 ~ file: app.js ~ line 163 ~ app.get ~ users \n ${users}`)
        //     // await saveToFile(`./json/${Date.now()}_TrueId_${j}.json`, users)
        //     await writeFile(`./json/${Date.now()}_TrueId_${j}.json`, JSON.stringify(users))

        // j++
        // console.timeEnd('answer time')
        // }

        for (let i = 0; i <= parseInt(total); i += 1000) {
            log(`skip ${i}, file ${j}`)
            // console.time('answer time')
            await saveToFile(i, j)
            // console.timeEnd('answer time')
            j++
            // console.log('🚀 ~ file: app.js ~ line 133 ~ app.get ~ data', data)
            // await writeFile(`./json/${Date.now()}_TrueId_${j}.json`, JSON.stringify(data))
            // await jsonfile
            //     .writeFile(`./json/${Date.now()}_TrueId_${j}.json`, data)
            //     .then((res) => {
            //         console.log('Write complete')
            //     })
            //     .catch((error) => console.error(error))
        }

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
