const mongoose = require('mongoose')

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

module.exports = mongoose.model('users', userModelSchema)
