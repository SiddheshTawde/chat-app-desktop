const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Session = require('../models/session');

/* 
  Register

    When registration is successful, "all user" event is fired globally.
    Anyone with all user sheet open will see user list updated.
*/
router.post('/signup', function (req, res, next) {
  const fullname = req.body.fullname.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (fullname === "" || email === "" || password === "") {
    // Input is empty
    res.send({ serverResponse: "Empty Inputs" });
  } else {
    if (regex.test(email) === false) {
      // Invalid Email format
      res.send({ serverResponse: "Invalid Email" });
    } else {
      // Check is email is taken OR user already exist
      User.findOne({ email: email })
        .then(userDoc => {
          if (userDoc !== null) {
            // user exists
            res.send({ serverResponse: "User Exists" });
          } else {
            // Create new
            bcrypt.hash(password, 10, function (err, hashedPassword) {
              if (err) {
                res.sendStatus(500).send({ serverResponse: err })
              } else {
                User.create({
                  fullname: fullname,
                  email: email,
                  password: hashedPassword,
                  picture: "",
                  picture_original: "",
                  contacts: [],
                  showOnboarding: true
                })
                  .then(() => {
                    // req.app.io.emit('all users', 'all users');
                    res.send({ serverResponse: "success" })
                  })
                  .catch(err => res.sendStatus(500).send({ serverResponse: err })) // from => User.create({ fullname: fullname, email: email, password: password, picture: "", contacts: [] })
              }
            })
          }
        })
        .catch(err => res.sendStatus(500).send({ serverResponse: err })); // from => User.findOne({ email: email })

    }
  }
});


/* 
  Sign In

    Verify user and set new session.
    User session expires after 1 year. After 1 year user needs to re-login.
*/
router.post('/signin', function (req, res, next) {
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email === "" || password === "") {
    // Empty input fields
    res.send({ serverResponse: "Empty Inputs" })
  } else {
    if (regex.test(email) === false) {
      // Invalid email
      res.send({ serverResponse: "Invalid Email" })
    } else {
      User.findOne({ email: email })
        .then(userDoc => {
          if (userDoc === null) {
            // user does not exist
            res.send({ serverResponse: "User does not exist" })
          } else {
            // console.log(userDoc);
            bcrypt.compare(password, userDoc.password)
              .then(result => {
                if (result === true) {
                  req.session.user = email;
                  req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 356;

                  res.send({ serverResponse: "success", sessionID: req.sessionID });
                } else {
                  res.send({ serverResponse: "Incorrect Password" })
                }
              })
              .catch(err => res.send({ serverResponse: err })) // from => bcrypt.compare(password, userDoc.password)
          }
        })
        .catch(err => res.send({ serverResponse: err })) // from => User.findOne({ email: email })
    }
  }

})


/* 
  Logout

    Logout user from app and delete user's session.
*/
router.post('/signout', function (req, res, next) {

  Session.deleteOne({ _id: req.body.sessionID })
    .then(() => res.send({ serverResponse: "success" }))
    .catch(err => res.send({ serverResponse: err }))

})


/* 
  All users

    Get list of all available users on app.
    
      4 Request Status:
        - true: Both users are in each other's contact list.
        - false: Neither user is in each other's contact list.
        - awaiting: You have sent requrest, but the other person has not accepted.
        - pending: Other person has sent you request, but you have not accepted.
*/
router.post('/all', function (req, res, next) {

  // Get my session
  Session.findOne({ _id: req.body.sessionID })
    .then(sessionDoc => {
      if (sessionDoc === null) {
        // Session does not exists - logout user
        res.send({ serverResponse: 'logout' })
      } else {

        // Get my user details
        User.findOne({ email: sessionDoc.session.user })
          .then(userDoc => {
            // Get list of all users
            User.find({})
              .then(allUsers => {
                let allUsersInfo = [];

                // Loop throught all users - including me
                allUsers.forEach(user => {

                  // Ignore my own record
                  if (user.id !== userDoc.id) {
                    // is Contact statuss
                    if (user.contacts.includes(userDoc.id) === true && userDoc.contacts.includes(user.id) === true) {
                      // Both are in each others contact

                      let userDetail = {};
                      userDetail['fullname'] = user.fullname;
                      userDetail['email'] = user.email;
                      userDetail['picture'] = user.picture;
                      userDetail['isContact'] = "true";

                      allUsersInfo.push(userDetail);

                    } else if (user.contacts.includes(userDoc.id) === true && userDoc.contacts.includes(user.id) === false) {
                      // I'm in this user's contact but this user is not in my contacts

                      let userDetail = {};
                      userDetail['fullname'] = user.fullname;
                      userDetail['email'] = user.email;
                      userDetail['picture'] = user.picture;
                      userDetail['isContact'] = "pending";

                      allUsersInfo.push(userDetail);

                    } else if (user.contacts.includes(userDoc.id) === false && userDoc.contacts.includes(user.id) === true) {
                      // I'm not in this user's contact but this user is in my contacts

                      let userDetail = {};
                      userDetail['fullname'] = user.fullname;
                      userDetail['email'] = user.email;
                      userDetail['picture'] = user.picture;
                      userDetail['isContact'] = "awaiting";

                      allUsersInfo.push(userDetail);

                    } else {
                      // None are in each others contact

                      let userDetail = {};
                      userDetail['fullname'] = user.fullname;
                      userDetail['email'] = user.email;
                      userDetail['picture'] = user.picture;
                      userDetail['isContact'] = "false";

                      allUsersInfo.push(userDetail);

                    }

                  }
                })
                res.send({ serverResponse: 'success', allUsersInfo: allUsersInfo })
              })
              .catch(err => res.send({ serverResponse: err })) // from => User.find({})

          })
          .catch(err => res.send({ serverResponse: err })) // from => User.findOne({ email: sessionDoc.session.user })
      }
    })
    .catch(err => res.send({ serverResponse: err })) // from => Session.findOne({ _id: req.body.sessionID })
})


module.exports = router;