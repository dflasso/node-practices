const message = require('../modules/message/network')
const users = require('../modules/user/network')

const routes = (server) => {
    server.use('/api/v1/messages', message)
    server.use('/api/v1/user', users)

}

module.exports = routes