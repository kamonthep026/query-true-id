const fs = require('fs')

const { log, errorLog } = require('./models/log.model')
// an array of filenames to concat
const files = []

const theDirectory = `./json` // or whatever directory you want to read
fs.readdirSync(theDirectory).forEach((file) => {
    // you may want to filter these by extension, etc. to make sure they are JSON files
    fs.readFile(`./json/${file}`, 'utf8', (err, jsonString) => {
        if (err) {
            errorLog(`Error reading file from disk: \n${err}`)
            return
        }
        try {
            const customer = JSON.parse(jsonString)
            customer.forEach((data) => {
                console.log('🚀 ~ file: jsonConcat.js ~ line 17 ~ fs.readFile ~ customer', data)
                files.push(data)
            })
        } catch (err) {
            errorLog(`Error parsing JSON string: \n${err}`)
        }
    })
})

setTimeout(() => {
    const jsonString = JSON.stringify(files)
    fs.writeFile('./result.json', jsonString, (err) => {
        if (err) {
            errorLog(`Error writing file \n${err}`)
        } else {
            log('Successfully wrote file')
            log(jsonString.length)
        }
    })
}, 10000)
