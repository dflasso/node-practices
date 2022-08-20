const { populate } = require('./model')
const Model = require('./model')


const saveMessage = (message) => {
    const entityMessage = new Model(message)
    entityMessage.save()
}

const getMessages = (filterUser) => {
    return new Promise((resolve, reject) => {
        let filter = {}
        if (filterUser !== null) {
            filter = { user: filterUser }
        }

        Model.find(filter)
            .populate('user') //se especifica que debe buscar en la coleccion user coincidencias, y se agrega los datos del usuario
            .exec((error, populated) => { //ejecuta la populación de datos
                if (error) {
                    reject(error)
                    return false
                }

                resolve(populated)
            });

    })


}

const updateMessage = async ({ id = "", message = "" }) => {
    const entityMessage = await Model.findOne({
        _id: id
    })

    entityMessage.message = message

    entityMessage.save()

    return entityMessage
}

module.exports = {
    save: saveMessage,
    getAll: getMessages,
    updateMessage: updateMessage
}