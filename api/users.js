const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//load models
const User = mongoose.model('users');

// @route   POST api/users/register
// @desc    register a new user
// @access  Public
router.post('/register', (req, res) => {
  //validation: IGNORE
  //check if username/email exists
  let errors = {}
  User.findOne({
      $or: [{
        email: req.body.email
      }, {
        username: req.body.username
      }]
    })
    .then((user) => {
      //if email exists send error
      if (user) {
        errors.email = "Email or Username already exists";
        return res.status(400).json(errors);
      } else {

        const newUser = {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        };
        //hash password with a salt
        bcrypt.genSalt(10, function (err, salt) {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            //create and save newUser to db
            const newUserDbInstance = new User(newUser);

            newUserDbInstance.save()
              .then(user => {
                const userData = user.toObject();
                delete userData.password;
                userData.id = user.id;
                jwt.sign(userData, process.env.SECRETKEY, {
                  expiresIn: 36000
                }, (err, token) => {
                  if (err) throw err;
                  return res.json({
                    success: true,
                    token: 'Bearer ' + token
                  });
                });
              })
              .catch(err => console.log(err));

          });
        });

      }

    })
});
// @route   POST api/users/login
// @desc    login existing user
// @access  Public
router.post('/login', (req, res) => {
  //validate form: IGNORE
  //check if user exists
  let errors = {}
  User.findOne({
      username: req.body.username
    })
    .then(user => {
      if (!user) {
        errors.username = "Username does not exist";
        return res.status(400).json(errors);
      } else {
        //compare password with stored hash
        bcrypt.compare(req.body.password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              errors.password = "Password Incorrect";
              return res.status(400).json(errors);
            } else {
              const userData = user.toObject();
              delete userData.password;
              userData.id = user.id;
              //sign jwt token
              jwt.sign(userData, process.env.SECRETKEY, {
                expiresIn: 360000
              }, (err, token) => {
                if (err) throw err;
                return res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              });
            }
          });
      }
    });
});
// @route   GET api/users/current
// @desc    get current authenticated user
// @access  Private
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      const userObj = user.toObject();
      delete userObj.password;
      userObj.id = user.id;
      return res.json({
        success: true,
        user: userObj
      });
    })
});
// @route   PUT api/users/approve/:userId
// @desc    approve user by id
// @access  Private (Admin)
router.put('/approve/:userId', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  let errors = {};
  User.findById(req.user.id)
    .then(user => {
      if (!user) {
        errors.user = "Active user does not exist";
        return res.status(401).json(errors);
      }
      if (!user.isAdmin) {
        errors.permission = "No permission";
        return res.status(403).json(errors);
      }
      User.findById(req.params.userId)
        .then(user => {
          if (!user) {
            errors.target = 'Target user does not exists';
            return res.status(401).json(errors);
          }
          User.findByIdAndUpdate(req.params.userId, {
              $set: {
                isApproved: true
              }
            }, {
              new: true
            })
            .then(user => {
              return res.json({
                success: true,
                user
              });
            });
        });
    });
});
// @route   GET api/users/
// @desc    See all users
// @access  Private (Admin)
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  let errors = {};
  User.findById(req.user.id)
    .then(user => {
      if (!user) {
        errors.user = "Not an exisiting user";
        return res.status(401).json(errors);
      }
      if (!user.isAdmin) {
        errors.permission = "No permission";
        return res.status(401).json(errors);
      }
      User.find({
          isAdmin: false
        })
        .then(users => {
          return res.json({
            success: true,
            users
          });
        });
    });
});
module.exports = router;