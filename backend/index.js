const express = require('express')
const { ObjectID, MongoClient } = require('mongodb')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

const url = 'mongodb://root:password@localhost:27017'
const progressiveOverloadTracker = 'progressiveOverloadTracker'
const client = new MongoClient(url)

async function connectToDatabase() {
    try {
        await client.connect()
        console.log('We\'re in.')

        return client.db(progressiveOverloadTracker)
    }
    catch (error) {
        console.error('Error connecting to database', error)
        throw error
    }
}

app.get('/', async function (req, res) {
    try {
        const db = await connectToDatabase()
        const collection = db.collection(progressiveOverloadTracker)
        const result = await collection.find({}).toArray()

        res.status(201).json({
            message: 'Successfully retrieved from database.',
            data: result
        })
    }
    catch (error) {
        console.error('Error retrieving data.', error)
        res.status(500).json({
            message: 'Error retrieving data.',
        })
    }
})

app.post('/', async (req, res) => {
    try {
        const db = await connectToDatabase()
        const collection = db.collection(progressiveOverloadTracker)
        const result = await collection.insertOne(req.body)

        res.status(201).json({
            message: 'Successfully added to database.',
            data: result
        })
    }
    catch {
        console.error ('Error inserting data: ', error)
        res.status(500).json({
            error: 'Something went wrong'
        })
    }
})




connectToDatabase()

app.listen(3000)
