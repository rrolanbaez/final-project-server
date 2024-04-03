// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;

// TRYING TO CREATE USER PROFILE PAGE:

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const isAuthenticated = require('../middleware/isAuthenticated');
const isOwner = require('../middleware/isOwner');

const User = require('../models/User');

// to get user info
router.get('/', isAuthenticated, (req, res, next) => {

  const { _id } = req.user;

  // Verifying if it has a valid Id. Its not really necessary 
  if (!mongoose.Types.ObjectId.isValid(_id)) {
      res.status(400).json({ message: 'Specified user id is not valid' });
      return;
  }

  User.findById(_id)
    .then((foundUser) => {
      console.log("Found user --->", foundUser)
      delete foundUser._doc.password
      res.json(foundUser)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    });
});

// update user profile
router.put('/update/', isAuthenticated, (req, res, next) => {

  const  userId  = req.user._id;

  // Verifying if it has a valid Id.
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Specified user id is not valid' });
      return;
  }

  User.findByIdAndUpdate( userId, {image: req.body.image}, {new: true})
    .then((updatedUser) => {
      console.log("Updated user --->", updatedUser)
      res.json(updatedUser)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    });
});

module.exports = router; 