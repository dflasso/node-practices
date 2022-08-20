const express = require('express')

const response = require('../../network/response')
const controller = require('./controller')

const router = express.Router()

router.get('/', (req, res) => {
    controller
        .getMessages()
        .then(data => {
            response.success(req, res, "process finished successfully", 200, data)
        })
})

router.post('/', (req, res) => {
    controller
        .addMessage(req.body.user, req.body.msg)
        .then(data => {
            response.success(req, res, "process finished successfully", 201, data)
        })
    
})

/**
 * al colocar :id se agrega un path variable
 */
router.patch('/:id', (req, res ) => {
    const handler = response.builderParserResponse({req, res})
    controller
        .updateMessage({ id: req.params.id, message: req.body.message })
        .then(handler.successfully)
        .catch(handler.failed)
})

module.exports = router