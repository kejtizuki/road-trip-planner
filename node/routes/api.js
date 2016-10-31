var express = require('express');
var router = express.Router();

router.route('/posts')

    //create a new post
    .post(function(req, res){

        //TODO create a new post in the database
        req.send({message:"TODO create a new post in the database"});
    })

    .get(function(req, res){

        //TODO get all the posts in the database
        req.send({message:"TODO get all the posts in the database"});
    })


module.exports = router;
