const express = require('express')
const bodyParses = require('body-parser')


const router = require('./network/routes')
const db = require('./db')
//init server
var app = express()

db.connect('mongodb://mongoadmin:secret@localhost:27017/admin?authMechanism=DEFAULT')
//routes
app.use(bodyParses.json())
app.use(bodyParses.urlencoded({extended: false}))

router(app)


app.use('/static', express.static('public'))


//port of server
app.listen(3000);
console.log('App started in localhost:3000')

