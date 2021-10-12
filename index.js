const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

const app = express();

app.use(helmet())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.json({
        message: 'cbg.sh - Short Urls for you and youre friends'
    })
})

// app.post('/url/:id', (req, res) => {
//     // TODO: get short url by id
// })

// app.get('/:id', (req, res) => {
//     // TODO: redirect to url
// })


// app.post('/url', (req, res) => {
//     // TODO: create a short url
// })



const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})