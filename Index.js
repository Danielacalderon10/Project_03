//--- Express module

const express = require('express');

//import libraries and data
const {users, schedules} = require('./data');
const data = require('./data');
const path = require('path');
let morgan = require('morgan');
let bcrypt = require('bcryptjs');
let ejs = require('ejs');


// ---Initialise express server
const app = express();
const PORT = 3000 || process.env.PORT;



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



//--- Routes

  
  app.get('/', (req, res) => {
    res.render('pages/home', { users, title: 'Welcome' });
  });

  // Get all users 
  app.get('/users', (req, res) => {
    res.render('pages/users', { users, title: 'Users' });
  });

  // Get all schedules 
    app.get('/schedules', (req, res) => {
      res.render('pages/schedules', { users, title: 'Schedules' });
      });


app.get('/users/:id', (req, res) => {
    let id = req.params.id
    console.log(id)

    //validation for the number of users that we have
    if(id >= data.users.length){
        // res.send('User not available')
        res.status(400).json({msg: "User is  not found"})
    }
    res.json(data.users[id])
   });

    

// get specific schedule
   ///validation for the schedule
app.get('/schedules/:id', (req, res) => {
    let ids = req.params.id
    console.log(ids)
    if(ids >= data.schedules.length){

        res.status(400).json({msg: "schedule not found"})
    }
    res.json(data.schedules[ids])
   });

   // get specific user all the schedules 

   app.get('/users/:id/schedules', (req, res) => {
    const user_id = req.params.id
    // console.log(id)
  let sch = []
    for(let i = 0; i < schedules.length; i++){
      console.log(schedules[i].user_id)
      // validation - lowercase?
      if(schedules[i].user_id == user_id ){
          // res.json(comps[i])
          // res.render("individualComp", { comp: comps[i]})
          sch.push(schedules[i])
      }
    }
    res.json(sch)
  })



   // create new user / require body parser

   app.post('/users', (req, res) => {
    console.log(req.body)
    //validate data 

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


    data.users.push(newUser)
    res.send(data.users)
  });

 // create new schedule/ require body parser

 app.post('/schedules', (req, res) => {
  console.log(req.body)
  //validate data ,

  //onlyallow  user_id, day, start_at, end_at}
  const {user_id, day, start_at, end_at} = req.body
  // encrypt data
  const newSchedule = {
    
      "user_id": user_id,
      "day": day,
      "start_at": start_at,
      "end_at": end_at
    
  }
  console.log(newSchedule)
  data.schedules.push(req.body)
  res.send(req.body)
});

  app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}`);
  });