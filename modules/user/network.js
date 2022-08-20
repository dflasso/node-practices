const express = require('express')

const response = require('../../network/response')
const controller = require('./controller')

const router = express.Router()


router.post('/', (req, res) => {
    const handlerResponse = response.builderParserResponse({req, res})
    controller
        .addUser(req.body.name)
        .then(handlerResponse.successfully)
        .catch(handlerResponse.failed)
    
})