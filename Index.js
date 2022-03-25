//1. --- Express module

const express = require('express');

//2. import libraries and data
const {users, schedules} = require('./data');
const data = require('./data');
const path = require('path');
let morgan = require('morgan');
let bcrypt = require('bcryptjs');
let ejs = require('ejs');


// ---Initialise express server
const app = express();
const PORT = 3000 || process.env.PORT;



//3. ---middleware
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



//4. --- Routes

    // main 
  app.get('/', (req, res) => {
    res.render('pages/home', { title: 'Welcome' });
  });

  // Get all users 
  app.get('/users', (req, res) => {
    res.render('pages/users', { users, title: 'Users' });
  });

  // Get all schedules 
    app.get('/schedules', (req, res) => {
      res.render('pages/schedules', { schedules, title: 'Schedules' });
      });

   // get user form
app.get('/addnewuser', (req, res) => {
  res.render('pages/newUser', { title: 'New Users' });
});

    // get schedule form
app.get('/addnewschedule', (req, res) => {
  res.render('pages/newSchedule', { title: 'New Schedule' });
});

    
 // Get specific users
app.get('/users/:user_id', (req, res) => {
  const index = req.params.user_id;
  const user = users[index];

  // validation to confirm number has been entered
  if (index >= users.length) {
    res.status(400).send(`msg: User ${index} is not found`);
  }
  res.render('pages/user', {user, title: 'User' })
});

// Get specific schedule
app.get('/schedules/:schedules_id', (req, res) => {
  const index = req.params.schedules_id;
  const schedule = schedules[index];

  if (index >= schedules.length) {
    res.status(400).send(`msg: Schedules ${index} is not found`);
  }
  res.render('pages/schedule', {schedule, title: 'Schedule' })
});

   // get specific user all the schedules  /users/:user_id/schedules

   app.get('/users/:user_id/schedules', (req, res) => {
    const id = req.params.user_id;
 
    const userschedule = schedules.filter((x) => x.user_id === parseInt(id));
    console.log(userschedule)
    res.render('pages/userSchedule', {userschedule})
    
    // res.json(_sched);
  })

//5. --POST

   // 5.1 create new user 

   app.post('/users', (req, res) => {
    console.log(req.body)
    //user inputs
    const {firstname, lastname, email, password} = req.body

    // encrypt data
let salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync(password, salt)

    //only allow key exa. firstname, lastname email and password 
const newUser = {
  "user_id": data.users.length,
  "firstname": firstname,
  "lastname": lastname,
  "email": email,
 "password": hash
}
console.log(newUser)

    users.push(newUser)
    res.redirect('/users')
  });

 // 5.2 create new schedule

 app.post('/schedules', (req, res) => {
  console.log(req.body)
  
  const {user_id, day, start_at, end_at} = req.body
  // encrypt data
  const newSchedule = {
    
      "user_id": user_id,
      "day": day,
      "start_at": start_at,
      "end_at": end_at
    
  }
  console.log(newSchedule)
  schedules.push(req.body)
  res.redirect('/schedules')
});


//6/ -- listen 
  app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}`);
  });