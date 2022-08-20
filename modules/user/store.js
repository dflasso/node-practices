const Model  = require('./model')

const addUser = user => {
    const userEntity = new Model(user)
    return userEntity.save()
}

module.exports = {
    add: addUser
}