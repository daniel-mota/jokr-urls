const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const yup = require('yup')
const monk = require('monk')
const { nanoid } = require('nanoid')

require('dotenv').config()

const db = monk(process.env.MONGO_DBURI)
const urls = db.get('urls')
urls.createIndex({ slug: 1 }, { unique: true })

const app = express();

app.use(helmet({
    contentSecurityPolicy: false
}))
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

app.get('/:id', async (req, res, next) => {
    const { id: slug } = req.params;
    try {
        const url = await urls.findOne({ slug })
        if (url) {
            res.redirect(url.url)
        }
        res.redirect(`/?error=${slug} not found`)
    } catch (error) {
        res.redirect(`/?error=Link not found`)
    }

})


const schema = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required()
})


app.post('/url', async (req, res, next) => {
    let { slug, url } = req.body;
    try {
        await schema.validate({
            slug,
            url
        })
        if (url.includes('jokrurls')) {
            throw new Error('Stop it.')
        }
        if (!slug) {
            slug = nanoid(5);
        } else {
            const existing = await urls.findOne({ slug })
            if (existing) {
                throw new Error('Slug in use. :(')
            }
        }
        slug = slug.toLowerCase()
        const newUrl = {
            url,
            slug,
        }
        const created = await urls.insert(newUrl)
        res.json(created)
    } catch (error) {
        next(error)
    }
})


app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status)
    } else {
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'pancakes' : error.stack
    })
})



const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})