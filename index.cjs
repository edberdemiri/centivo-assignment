/**
 * Simple Node.js Express API that connects to MongoDB and retrieves user data.
 *
 * Features:
 * - GET /users/:id to fetch a user by ObjectId
 * - Only returns users with age > 21
 * - Handles invalid ObjectId formats (400)
 * - Returns 404 if user is not found or underage
 * - Uses native MongoDB Node.js driver
 *
 * To run:
 * 1. Ensure MongoDB is running at mongodb://localhost:27017
 * 2. Install dependencies: npm install
 * 3. Start the server: npm start
 *
 * Author: Edber Demiri
 * Date: 05-08-2025
 */

const express = require('express')
const {MongoClient, ObjectId} = require('mongodb');

const port = 3000;

const app = express()

const mongo_url = 'mongodb://localhost:27017';
const client = new MongoClient(mongo_url);

const dbName = 'Centivo';

(async () => {
    try {
        await client.connect()
        console.log('Successfully connected to MongoDb server')
    } catch (err) {
        console.error('Error while connecting to MongoDb Server', err)
        process.exit(1)
    }

})()


app.get('/users/:id', async (req, res) => {
    /**
     * GET /users/:id
     *
     * Retrieves a user by id from the users collection in MongoDb
     *
     * Requirements:
     * - ID must be a valid MongoDb ObjectId
     * - Only returns the users if the age is 21+
     *
     * Responses:
     * - 200 OK with user data in JSON format
     * - 400 Bad Request if ID is invalid
     * - 404 Not Found if user is not found or if underage
     * - 500 Internal Server Error for issues with the database
     *
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {void}
     *
     * **/

    const user_id = req.params.id;
    if (!ObjectId.isValid(user_id)) {
        console.error('Invalid user id')
        return res.status(400).json({msg: 'Invalid Params'})
    }

    const db = await client.db(dbName)
    const collection = await db.collection('users')

    try {
        const user = await collection.findOne({_id: new ObjectId(user_id), age: {'$gt': 21}})

        res.status(200).json({user})
    } catch (err) {
        console.error('Mongo query error:', err)
        res.status(500).json({msg: 'Internal server error'})
    }
})

app.listen(port, (err) => {
    if (err) {
        console.error(err)
    }
    console.log(`Server running on port: ${port}`)
})
