const express  = require('express');
const passport = require('passport');
const router   = express.Router();
const User     = require('../../models/user.model');
const bcrypt   = require('bcrypt');
const sendEmail = require('../../mailing/send');


router.post("/login", (req, res, next) => {
  passport.authenticate('local', (err, user, info) =>  {
    if (err) { return next(err); }

    if (!user) { return res.status(401).json(info); }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          message: 'something went wrong :('
        });
      }
      res.status(200).json(req.user);
    });
  })(req, res, next);
});

router.post("/signup", (req, res, next) => {
  console.log(req.body)
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Please provide all fields" });
    ;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      return res
          .status(400)
          .json({ message: "The username already exists" });
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConfirmation = bcrypt.hashSync(username, salt)
    const newUser = User({
      username,
      email,
      password: hashPass,
      confirmationCode: hashConfirmation
    });

    newUser.save((err) => {
      if (err) {
        res.status(400).json({ message: "Something went wrong" });
      } else {
        // req.login(newUser, function(err) {
        //   if (err) {
        //     return res.status(500).json({
        //       message: 'something went wrong'
        //     });
        //   }

          var buffer = new Buffer(newUser.confirmationCode);
          var encoded = buffer.toString('base64');


          sendEmail(newUser.username, newUser.email, encoded)
          return res.status(200).json(req.user);
        // })
      }
    });
  });
});

router.get("/logout", function(req, res) {
  req.logout();
  res.status(200).json({ message: 'Success' });
});

router.get("/loggedin", function(req, res) {
  if(req.isAuthenticated()) {
    return res.status(200).json(req.user);
  }

  return res.status(403).json({ message: 'Unauthorized' });
});

router.get("/confirm/:hash", (req, res) => {

  var buffer = new Buffer(req.params.hash, 'base64')
  var hashResponse = buffer.toString();

  User.findOne({confirmationCode: hashResponse}, "confirmationCode")
    .then(user=>{
      if(user == null) {
        return res.status(500).json({message: "Something went wrong"})
      }
      User.findByIdAndUpdate(user.id, {status: "Active"})
      .then(user=>{
        console.log(user)
        console.log(`User ${user.username} has been activated`);

        req.login(user, function(err) {
          if (err) {
            return res.status(500).json({
              message: 'something went wrong'
            });
          }

          console.log(req.user)
          return res.status(200).json(req.user);
        })
      })
      .catch(err => {
        return res.status(500).json({
          message: 'something went wrong'
        });
      })
  })
});

module.exports = router;
