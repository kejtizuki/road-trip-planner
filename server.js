var express = require('express')
var mongodb = require('mongodb')
var bodyParser = require('body-parser')
var uuid = require('uuid')
var tokenMiddleware = express.Router();

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

function register(req, res, callback) {

  var users = req.db.collection('users')

  console.log(req.body);
  var user = req.body.username;
  var token = uuid.v1();
  users.insert({
    username: req.body.username,
    password: req.body.password,
    token: token
  });

  res.json({ status: "OK", token: token });
  res.end();
  // users.updateOne({ username: user.username }, { $set: { token: token } }, function (err, result) {
  //   callback(!err ? token : null)
  // })
}

//wywoluje listen w tej funkcji dlatego ze aplikacja uruchomi sie tylko gdy jest polaczenie z baza
connect(function (db) {
  app.use(bodyParser.json())
  app.use(wrapper(db))
  app.use('/login', tokenMiddleware);
  app.use('/register', register)
  app.post('/login', login)
  app.use(express.static('.'))



  tokenMiddleware.use(function(req, res, next) {
    console.log(req.body);
    var token = req.body.token;
    next();
  });

  app.listen(PORT, function () {
    console.log('Listening on port:', PORT)
  })

})
