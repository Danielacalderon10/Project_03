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
  db.any('SELECT * FROM users')
  .then((users) => {
    // if success;
  const index = req.params.user_id;
  const user = users[index];

  // validation to confirm number has been entered
  if (index >= users.length) {
    res.status(400).send(`msg: User ${index} is not found`);
  }
  res.render('pages/user', {user, title: 'User' })

})
.catch((error) => {
  // error;
  console.log(error)
  res.redirect("/error?message=" + error.message)
});
});


// get specific schedule
app.get('/schedules/:schedule_id', (req, res) => {
  db.any('SELECT * FROM schedules')
  .then((schedules) => {
    // if success;
  const index = req.params.schedule_id;
  const schedule = schedules[index];

  // validation to confirm number has been entered
  if (index >= schedules.length) {
    res.status(400).send(`msg: schedule ${index} is not found`);
  }
  res.render('pages/schedule', {schedule, title: 'schedule' })

})
.catch((error) => {
  // error;
  console.log(error)
  res.redirect("/error?message=" + error.message)
});
});

// POST new user
app.post('/users', (req, res) => {
  // 1. Destructure user keys
  db.any('SELECT * FROM users')
  .then((users) => {
    // if success;
  const { user_id, firstname, lastname, email, password } = req.body;
  // 2. Encrypt the password with bcryptJS
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  // Store hash in your password DB by creating new user
  const newUser = {
    "user_id": user_id,
    "firstname": firstname,
    "lastname": lastname,
    "email": email,
    "password": hash

  };

  // Push newUser to data array and redirect to users
  db.none('INSERT INTO users(firstname, lastname, email, password) VALUES ($1, $2, $3, $4)', [firstname, lastname, email, hash])
  .then(() => {
    res.redirect('/users');
})

.catch((error) => {
  // error;
  console.log(error)
  res.send(error.message)
});
});
})


// POST new schedule
app.post('/schedules', (req, res) => {
  // 1. Destructure user keys
  db.any('SELECT * FROM schedules')
  .then((schedules) => {
    // if success;
    const {userid, day, start_at, end_at} = req.body
    // encrypt data
    const newSchedule = {
        "userid": userid,
        "day": day,
        "start_at": start_at,
        "end_at": end_at 
    }
// Push newUser to data array and redirect to schedules --
// it says null when I entry an userid
db.none('INSERT INTO schedules(userid, day, start_at, end_at) VALUES ($1, $2, $3, $4)', [userid, day, start_at, end_at])
.then(() => {
  res.redirect('/schedules');
})

.catch((error) => {
// error;
console.log(error)
res.send(error.message)
});
});
})

  // get specific user all the schedules 

  app.get('/users/:userid/schedules', (req,res) => {
    db.any('SELECT * FROM schedules')
    .then((schedules) => {
      const id = req.params.userid;
 
    const userschedule = schedules.filter((x) => x.userid === parseInt(id));
    console.log(userschedule)
    res.render('pages/userSchedule', {userschedule})

})
    .catch((error) => {
        // error;
        console.log(error)
        res.redirect("/error?message=" + error.message)
    });
  
}) 

  

// GET error
app.get('*', (req, res) => {
   res.render('pages/error', {title: '404'});
 });


//5
// listen to express

  app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}`);
  });

