const db = require('mongoose')

db.Promise = global.Promise

async function connect(url) {
    db.connect(url, 
    {
        useNewUrlParser: true
    }).then(() => {
        console.log('[DB] - conection successfully ')
    })    
}

module.exports = {connect}

