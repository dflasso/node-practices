const express = require('express')
const app = express()
const port = 3000

//middleware
app.use(express.json())

//http://localhost:3000/variable?limit=5&offset=10
app.get("/:pathVariable", (req, res ) => {
    const {pathVariable} = req.params;
    const {limit , offset} = req.query;
    console.log(`pathVariable : ${pathVariable}    query params : ${limit}, ${offset}`)
    res.send({
        test: "ss"
    })
})

app.listen(port , () => {
    console.log('Started App in localhost:3000')
})