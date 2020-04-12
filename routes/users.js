const express = require('express');
const router = express.Router();
const fs = require('fs');
const Jimp = require('jimp');
const path = require('path');

const Session = require('../models/session');
const User = require('../models/user');
const Chat = require('../models/chat');

const multer = require('multer');
const upload = multer({ dest: 'public/images' });

/*
  Get user's info
    Get Logged in user's basic info:
      - Fullname
      - Email
      - Profile Picture
*/
router.get('/:sessionID', async function (req, res, next) {

  let sessionDoc = await Session.findOne({ _id: req.params.sessionID }).exec();

  if (sessionDoc === null) {
    // Session does not exists - logout user
    res.send({ serverResponse: 'logout' })
  } else {
    let userDoc = await User.findOne({ email: sessionDoc.session.user }).exec();

    let userInfo = {};
    userInfo['fullname'] = userDoc.fullname;
    userInfo['email'] = userDoc.email;
    userInfo['picture'] = userDoc.picture;
    userInfo['picture_original'] = userDoc.picture_original;
    userInfo['showOnboarding'] = userDoc.showOnboarding;

    res.send({ serverResponse: 'success', userInfo: userInfo })
  }

});


/*
  Add to contact
    Add other person's id to you contact list.
    
    Note: Converstaion is not created unless the other person accepts.
*/
router.post('/add', function (req, res, next) {
  /* Note: add other person's id to your contacts */

  User.findOne({ email: req.body.userEmail })
    .then(userDoc => {
      if (userDoc === null) {
        // special case - highly unlikely
      } else {
        Session.findOne({ _id: req.body.sessionID })
          .then(sessionDoc => {
            if (sessionDoc === null) {
              res.send({ serverResponse: 'logout' })
            } else {
              User.findOneAndUpdate({ email: sessionDoc.session.user }, { $push: { contacts: userDoc.id } }, { new: true })
                .then(() => {

                  req.app.io.emit('update chats');

                  res.send({ serverResponse: 'success' })

                })
                .catch(err => res.send({ serverResponse: err })) // from => User.findOneAndUpdate({ email: sessionDoc.session.user }, { $push: { contacts: userDoc.id } }, { new: true })
            }
          })
          .catch(err => res.send({ serverResponse: err })) // from => Session.findOne({ _id: req.body.sessionID })
      }
    })
    .catch(err => res.send({ serverResponse: err })) // from => User.findOne({ email: req.body.userEmail })

})


/*
  Accept chat invitation
  
    Accept chat request already sent.
    Requester's id is added to your contact list
    
    Important Note: Converstaion IS created and same conversation tag is added for both users.
*/
router.post('/accept', function (req, res, next) {
  /* Note: add your id to other person's contacts */

  User.findOne({ email: req.body.userEmail })
    .then(userDoc => {
      if (userDoc === null) {
        // special case - highly unlikely
      } else {
        Session.findOne({ _id: req.body.sessionID })
          .then(sessionDoc => {
            if (sessionDoc === null) {
              res.send({ serverResponse: 'logout' })
            } else {
              User.findOneAndUpdate({ email: sessionDoc.session.user }, { $push: { contacts: userDoc.id } }, { new: true })
                .then(() => {

                  User.findOne({ email: sessionDoc.session.user })
                    .then(user => {
                      Chat.create({ isGroup: false, displayname: "", participants: [userDoc.id, user.id], messages: [] })
                        .then(chat => {

                          User.findOneAndUpdate({ email: userDoc.email }, { $push: { chats: chat.id } })
                            .catch(err => console.log(err))

                          User.findOneAndUpdate({ email: user.email }, { $push: { chats: chat.id } })
                            .catch(err => console.log(err))

                          req.app.io.emit('update chats');

                          res.send({ serverResponse: 'success' })
                        })
                        .catch(err => res.send({ serverResponse: err })) // from => Chat.create({ isGroup: false, displayname: "", participants: [req.body.userEmail, userDoc.id], messages: [] })

                    })
                    .catch(err => res.send({ serverResponse: err })) // from => User.findOne({ email: sessionDoc.session.user })

                })
                .catch(err => res.send({ serverResponse: err })) // from => User.findOneAndUpdate({ email: sessionDoc.session.user }, { $push: { contacts: userDoc.id } }, { new: true })
            }
          })
          .catch(err => res.send({ serverResponse: err })) // from => Session.findOne({ _id: req.body.sessionID })
      }
    })
    .catch(err => res.send({ serverResponse: err })) // from => User.findOne({ email: req.body.userEmail })

})


/*
  Reject chat invitation.
    Reject chat request already sent.
    Your id is removed from requester's contact list
    
    Note: Converstaion is not created.
 */
router.post('/reject', function (req, res, next) {
  /* Note: Remove your id from other person's contacts */

  Session.findOne({ _id: req.body.sessionID })
    .then(sessionDoc => {
      if (sessionDoc === null) {
        res.send({ serverResponse: 'logout' })
      } else {
        User.findOne({ email: sessionDoc.session.user })
          .then(userDoc => {

            User.findOneAndUpdate({ email: req.body.userEmail }, { $pull: { contacts: userDoc.id } })
              .then(() => {

                req.app.io.emit('update chats');

                res.send({ serverResponse: 'success' })
              })
              .catch(err => res.send({ serverResponse: err })) // from => User.findOneAndUpdate({ email: req.body.userEmail }, { $pull: { contacts: userDoc.id } })
          })
          .catch(err => res.send({ serverResponse: err })) // from => User.findOne({ email: sessionDoc.session.user })
      }

    })
    .catch(err => res.send({ serverResponse: err })) // from => Session.findOne({ _id: req.body.sessionID })

})


/* 
  Remove an existing contact. - TBD
    Remove a user from your contact list
    ** Remove contacts from each other's id BUT keep converstaion for other person. Remove youself from conversation **
*/
router.post('/remove', function (req, res, next) {
  console.log(req.body);
  res.send({ serverResponse: 'success' });
})


/* 
  Update profile picture
    Upload picture. Everyone on the app will receive updated profile picture
*/
router.post('/updatePicture', upload.single('picture'), function (req, res, next) {

  // If uploads folder does not exists, create one.
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  // rename the original file with _o extension.
  fs.rename(req.file.path, req.file.path + "_o." + req.file.mimetype.split('/')[1], function (err) {
    if (err) {
      res.send({ serverResponse: 'error in changing image' })
    }

    let filename = req.file.filename + "_o." + req.file.mimetype.split('/')[1];

    // resize orginal to 40x40 px resolution. Used at most places
    Jimp.read("uploads/" + filename, (err, original) => {
      if (err) {
        throw err;
      } else {
        original
          .resize(40, 40)
          .quality(40)
          .write("uploads/" + req.file.filename + "." + req.file.mimetype.split('/')[1]);

        // Update user's document with the URL of both images
        User.findOneAndUpdate({ email: req.body.email }, { picture: req.file.filename + "." + req.file.mimetype.split('/')[1], picture_original: filename })
          .then((doc) => {

            // Delete previos pictures if they exist
            if (doc.picture !== "" && doc.picture_original !== "") {
              fs.unlinkSync(path.join(__dirname, `../uploads/${doc.picture}`))
              fs.unlinkSync(path.join(__dirname, `../uploads/${doc.picture_original}`))
            }

            // updates your profile picture for everybody on the app
            req.app.io.emit('update picture');

            res.send({ serverResponse: 'success' });
          })
          .catch(err => res.send({ serverResponse: err })) // from => User.findOneAndUpdate({ email: req.body.email }, { picture: "data:" + imageType + ";base64," + fileToUpload })

      }
    })

  })
})

/* 
  Update Fullname
 
    Everyone on the app will receive updated fullname
*/
router.post('/updateFullname', function (req, res, next) {
  User.findOneAndUpdate({ email: req.body.email }, { fullname: req.body.fullname })
    .then(() => {

      // update's your profile picture for everybody on the app
      req.app.io.emit('update fullname', 'update fullname');

      res.send({ serverResponse: 'success' });
    })
    .catch(err => res.send({ serverResponse: err })) // from => User.findOneAndUpdate({ email: req.body.email }, { picture: "data:" + imageType + ";base64," + fileToUpload })
})

/* 
  Onbording User
 
    Show onboarding screen after user logs in for the first time
*/
router.post('/onboarding', function (req, res, next) {
  Session.findOne({ _id: req.body.sessionID })
    .then(sessionDoc => {
      if (sessionDoc === null) {
        // user does not exist
        res.send({ serverResponse: 'logout' })
      } else {
        User.findOneAndUpdate({ email: sessionDoc.session.user }, { showOnboarding: false }, { new: true })
          .then((updatedDoc) => {

            let userInfo = {}
            userInfo['fullname'] = updatedDoc.fullname;
            userInfo['email'] = updatedDoc.email;
            userInfo['picture'] = updatedDoc.picture;
            userInfo['picture_original'] = updatedDoc.picture_original;
            userInfo['showOnboarding'] = updatedDoc.showOnboarding;

            res.send({ serverResponse: 'success', userInfo: userInfo });
          })
          .catch(err => res.send({ serverResponse: err })) // from => User.updateOne({ email: sessionDoc.session.user }, { showOnboarding: false })
      }
    })
    .catch(err => res.send({ serverResponse: err })) // from => Session.findOne({ _id: req.body.sessionID })
})

module.exports = router;
