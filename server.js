//___________________
//Dependencies
//___________________
const express = require('express');
const app = express ();
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const db = mongoose.connection;
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/'+ `live-local`;

// Connect to Mongo
mongoose.connect(MONGODB_URI ,  { useNewUrlParser: true});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// open the connection to mongo
db.on('open' , ()=>{});

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

//Model
const newEvents = require('./models/seed.js')
const Event = require('./models/model.js')

//Populating seed Data
// app.get('/seed', async (req, res) => {
//   try {
//     const seedEvents = await Event.create(newEvents)
//     res.send(seedEvents)
//   } catch (err) {
//     res.send(err.message)
//   }
// })

//___________________
// Routes
//___________________
//localhost:3000

app.get('/' , (req, res) => {
  res.send('Live-Local App');
});

app.get('/map', (req, res) => {
   res.render('map.ejs', {
       mapLocations: [{
           lat: 43,
           lng: -72
       }]
   });
  })

app.get('/list', (req, res) => {
    Event.find( (error, allEvents)=>{
        // console.log(allItems)
        if(error) {
          res.status(418).json({"myerror": error})
        }
        res.render('list.ejs', {
            event: allEvents
        });
    });
  })

  // New
app.get('/new', (req, res) => {
    res.render('new.ejs')
  })

// Create
app.post('/', (req, res) => {
    Event.create(req.body, (error, createdEvent)=>{
        if (error) {
            res.send(error)
        } else {
            res.redirect('/map');
        }
    });
  })


// Delete
app.delete('/list/:id', (req, res) => {
    console.log(typeof(req.params.id))
    Event.findByIdAndRemove(Number(req.params.id), (err, deletedEvent)=>{
        
        res.redirect('/list');
    });
  })


//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));