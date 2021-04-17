// Main (required)
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

// dotENV (required)
const port = process.env.PORT || 5555;
const name = process.env.DB_NAME;
const pass = process.env.DB_PASS;
const dbName = process.env.DB_MAIN;
const mcCollection = process.env.DB_MACO;
const reCollection = process.env.DB_RECO;
const uri = `mongodb+srv://${name}:${pass}@cluster0.lq9rh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

app.use(cors())
app.use(bodyParser.json())

// Set connection with database
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('Connection error:', err);
  // Product Collections
  const servicesCollection = client.db(dbName).collection(mcCollection);
  console.log('Database Connected Successfully!');
  
  // Add Service API
  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new Service', newService);
    servicesCollection.insertOne(newService)
    .then(result => {
      console.log('inserted count:', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  // All Services List API
  app.get('/services', (req, res) => {
    servicesCollection.find()
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  // Delete a Service API
  app.delete('/serviceDelete/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    servicesCollection.deleteOne({_id: id})
    .then(result => {
      console.log(result);
    })
  })

  // app.get('/product/:id', (req, res) => {
  //   const id = ObjectID(req.params.id);
  //   servicesCollection.find({_id: id})
  //   .toArray((err, documents) => {
  //     res.send(documents);
  //   })
  // })


  // app.patch('/update/:id', (req, res) => {
  //   const id = ObjectID(req.params.id);
  //   servicesCollection.updateOne(
  //     {_id: id},
  //     {
  //       $set: {name: req.body.productName, weight: req.body.weight, price: req.body.addPrice}
  //     }
  //   )
  //   .then(result => {
  //     console.log('updated');
  //   })
  // })


  // Review Collections
  const reviewsCollection = client.db(dbName).collection(reCollection);
  // console.log(reviewsCollection);


  // Review Collections Setup
  app.post('/addReviews', (req, res) => {
    const newReview = req.body;
    console.log(newReview);
    reviewsCollection.insertOne(newReview)
    .then(result => {
      console.log('inserted count:', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/reviews', (req, res) => {
    // console.log(req.query.email);
    reviewsCollection.find()
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // Root Path
  app.get('/', (req, res) => {
    res.send("Hello, Viewers! This URL from localhost is available now!")
  })

  // client.close();
});



app.listen(port)