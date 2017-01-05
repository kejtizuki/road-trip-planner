var express = require('express')
var mongodb = require('mongodb')
var bodyParser = require('body-parser')
var uuid = require('uuid')
var tokenMiddleware = express.Router();
var morgan = require('morgan');

var app = express()
var PORT = 9000
var url = "mongodb://admin:admin@ds143777.mlab.com:43777/roadtripplanner"

var MongoClient = mongodb.MongoClient

//callback - ak sie polaczy z mongodb to wykonaj cos
function connect (callback) {
  MongoClient.connect(url, function (err, db) {
    if (!err) {
      console.log('Connected to MongoDB')
      callback(db)
    } else {
    console.log('Error while connecting to MongoDB')
      console.log(err)
    }
  })
}


//zeby miec dostep do db wewnatrz funkcji connect
function wrapper (db) {
  return function (req, res, next) {
    req.db = db
    next()
  }
}

function updateUserToken (db, user, callback) {
  var users = db.collection('users')
  var token = uuid.v1()
  users.updateOne({ username: user.username }, { $set: { token: token } }, function (err, result) {
    callback(!err ? token : null)
  })
}

function login (req, res) {
  var users = req.db.collection('users')
  users.findOne({ username: req.body.username }, function (err, user) {
    new Promise(function (resolve, reject) {
      if (!err) {
        if (!user) {
          reject('Username does not exist')
        }
        else {
          if (user.password === req.body.password) {
            updateUserToken(req.db, user, function (result) {
              if (result) {
                resolve(result)
              }
              else {
                reject('Token error')
              }
            })
          }
          else {
            reject('Incorrect password')
          }
        }
      }
      else {
        reject('An error has occured')
      }
    })
    .then(function (token) {
      //tutaj trafia jestli jest wywolane resolve
      res.send(token)
    })
    .catch(function (error) {
      //tutaj jestli jest wywolane reject
      res.status(401).send(error)
    })
  })
}

function getProfile(req, res) {
  //req przychodzi z frontendu
  //res zwraca do frontu z backendu
  var data = req.body.token; //data jest tokenem bo na froncie wyslalismy token
  var users = req.db.collection('users')

  //pobiera z bazy usera o podanym tokenie
  users.findOne({ token: data }, function (err, user) {
    new Promise(function (resolve, reject) {
      if (err) {
        reject('Error');
        console.log("error err");
        //res.json({status: false});
      }
      else if(!user) {
        //res.json({status: false, message: "User not exist"});
        reject('User not found');
        console.log("error user not found");

      }
      else {
        // res.json(user);
        // res.end();
        resolve(user);
        // res.json(user);
      }
    })
    .then(function (user) {
      //res.json(user);
      var test = JSON.stringify(user)
      res.send(test);
    })
    .catch(function(error) {
      res.status(401).send();
    })
  })
  console.log(data);
}

function register(req, res, callback) {

  var users = req.db.collection('users')

  console.log(req.body);
  var user = req.body.username;
  var token = uuid.v1();
  users.insert({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    name: req.body.name,
    surname: req.body.surname,
    dateOfBirth: req.body.dateOfBirth,
    token: token,
    history: []
  });

  res.json({ status: "OK", token: token });
  res.end();
  // users.updateOne({ username: user.username }, { $set: { token: token } }, function (err, result) {
  //   callback(!err ? token : null)
  // })
}

function addToHistory(req, res, next) {
  console.log("history: ", req.body.history);

  var users = req.db.collection('users')
  users.updateOne({token: req.body.user.token}, {$addToSet: {history: req.body.history}});
  res.json({ststus: "OK", user: req.body.user});
  res.end();
}

//wywoluje listen w tej funkcji dlatego ze aplikacja uruchomi sie tylko gdy jest polaczenie z baza
connect(function (db) {
  app.use(bodyParser.json())
  app.use(wrapper(db));
  app.use(morgan('dev'))
  app.use('/login', tokenMiddleware);
  app.use('/register', register);
  app.use('/profile', getProfile);
  app.use('/history', addToHistory)
  app.post('/login', login);
  //app.post('/profile', getProfile);
  app.use(express.static('.'));

  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  })



  tokenMiddleware.use(function(req, res, next) {
    console.log(req.body);
    var token = req.body.token;
    next();
  });

  app.listen(PORT, function () {
    console.log('Listening on port:', PORT)
  })

})
