const userModel = require('./user.mongo')

async function findUsers(filter, skip, limit, sort) {
    return await userModel.find(filter).skip(skip).limit(limit).sort(sort)
}

async function estimatedDocumentCountUsers(filter, skip, limit, sort) {
    return await userModel.estimatedDocumentCount(filter).skip(skip).limit(limit).sort(sort)
}

module.exports = {
    findUsers,
    estimatedDocumentCountUsers,
}
