// 1.
//--- Express module
const express = require('express');
// ---Initialise express server
const app = express();
// -- create port variable
const PORT = 3000 || process.env.PORT;


// 2. 
//import libraries and data
const path = require('path');
let morgan = require('morgan');
let bcrypt = require('bcryptjs');
let ejs = require('ejs');
const db = require('./database')


//3.
//---middleware
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public'))) 

//bodypaser
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//LogingMiddeare
app.use(morgan('dev'));

//ejs config
app.set('view engine', 'ejs') // sets ejs as view engine
app.set('views', './views') // sets 'views' folder as teh folder for grabbing templates when res.rendering


//4.
//--- Routes

//CRUD commands

//create, read, update, delate

//http verbs

//post, get, put/patch, delate

//ROOT
app.get('/', (req,res) => {
  res.render('pages/home')
}
)

app.get('/schedules', (req,res) => {
  db.any('SELECT * FROM schedules')
  .then((schedules) => {
      // if success;
      console.log(schedules)

      res.render('pages/schedules',
      {schedules,
      title: 'ALL schedules'})
  })
  .catch((error) => {
      // error;
      console.log(error)
      res.redirect("/error?message=" + error.message)
  });
});

//5
// listen to express

  app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}`);
  });