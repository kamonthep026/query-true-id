const mongoose = require('mongoose')

const { errorLog } = require('./log.model')
//Define a schema
const Schema = mongoose.Schema

const userModelSchema = new Schema({
    _id: { type: mongoose.ObjectId },
    networkId: { type: mongoose.ObjectId },
    publicId: { type: String },
    __v: { type: Number },
    createdAt: { type: Date },
    displayName: { type: String },
    roleIds: [mongoose.ObjectId],
    updatedAt: { type: Date },
    flagCount: { type: Number },
    flags: [],
    isAdmin: { type: Boolean },
    displayNameSuffix: [String],
    displayNameTokenize: { type: String },
    publicIdTokenize: { type: String },
    path: { type: String },
})

const userModel = mongoose.model('users', userModelSchema)

module.exports = { userModel }
