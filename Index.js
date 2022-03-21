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
//schedules
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


//users
app.get('/users', (req,res) => {
  db.any('SELECT * FROM users')
  .then((users) => {
      // if success;
      console.log(users)

      res.render('pages/users',
      {users,
      title: 'ALL Users'})
  })
  .catch((error) => {
      // error;
      console.log(error)
      res.redirect("/error?message=" + error.message)
  });
});

// GET user form
app.get('/users/add', (req, res) => {
  res.render('pages/newUser', {title: 'Add User'});
});

// GET specific users
app.get('/users/:user_id', (req, res) => {
  const index = req.params.user_id;
  const user = users[index];

  // validation to confirm number has been entered
  if (index >= users.length) {
    res.status(400).send(`msg: User ${index} is not found`);
  }
  res.render('pages/user', {user})
});

// POST new user
app.post('/users', (req, res) => {
  // 1. Destructure user keys
  const { firstname, lastname, email, password } = req.body;
  // 2. Encrypt the password with bcryptJS
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  // Store hash in your password DB by creating new user
  const newUser = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: hash
  };

  // Push newUser to data array and redirect to users
  users.push(newUser);
  res.redirect('/users');
});


//5
// listen to express

  app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}`);
  });