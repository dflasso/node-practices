const store = require('./store')

const addMessage = (sender , msg ) => {
    return new Promise((resolve, reject) => {
        const newMessage = {
            user: sender,
            message: msg,
            date: new Date().toISOString()
        }

        store.save(newMessage)

        resolve(newMessage)
    })
}

const getMessages = () => {
    return new Promise((resolve, reject) => {
        resolve(store.getAll())
    })
}

const updateMessage = ({id = "", message = ""}) => {
    return new Promise((resolve, reject) => {
        const updatedRegister =  store.updateMessage({id, message})
        resolve(updatedRegister)
    })
}

module.exports = {
    addMessage,
    getMessages,
    updateMessage
}