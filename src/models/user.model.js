const userModel = require('./user.mongo')

async function findUsers(filter, skip, limit) {
    return await userModel.find(filter).skip(skip).limit(limit)
}

async function estimatedDocumentCountUsers(filter, skip, limit) {
    return await userModel.estimatedDocumentCount(filter).skip(skip).limit(limit)
}

module.exports = {
    findUsers,
    estimatedDocumentCountUsers,
}
