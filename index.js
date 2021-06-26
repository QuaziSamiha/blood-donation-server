const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5011

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Donate Blood, Save Life!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jezdg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const donorsCollection = client.db("BloodDonation").collection("Donors");

    // uploading donor data in database
    app.post('/beDonor', (req, res) => {
        const newDonor = req.body;
        donorsCollection.insertOne(newDonor)
            .then(result => {
                console.log('inserted count: ', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    // loading donors data from database and display on search page
    app.get('/searchDonors', (req, res) => {
        // console.log(req.query.bloodGroup);
        donorsCollection.find({ city: req.query.city, bloodGroup: req.query.bloodGroup })
            .toArray((error, donors) => {
                res.send(donors);
            })
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})