const express = require('express');
const router = express.Router();
const aes256 = require('aes256');

const key = process.env.AES_ENCRYP_KEY;

const Session = require('../models/session');
const User = require('../models/user');
const Chat = require('../models/chat');

router.get('/:sessionID', async function (req, res, next) {

  let sessionDoc = await Session.findOne({ _id: req.params.sessionID }).exec();

  if (sessionDoc === null) {
    // Session does not exists - logout user
    res.send({ serverResponse: 'logout' })
  } else {
    let userDoc = await User.findOne({ email: sessionDoc.session.user }).exec();

    if (userDoc.chats.length > 0) {
      let chats = [];

      for (let i = 0; i < userDoc.chats.length; i++) {
        let chatInfo = {}

        let chat = await Chat.findOne({ _id: userDoc.chats[i] }).exec();

        chatInfo['tag'] = chat.id;
        chatInfo['isGroup'] = chat.isGroup;
        chatInfo['displayname'] = chat.displayname;
        if (chat.messages.length === 0) {
          chatInfo['messages'] = chat.messages;
        } else {
          let decryptedMessages = [];
          chat.messages.forEach(message => {
            decryptedMessages.push(JSON.parse(aes256.decrypt(key, message)));
          })
          chatInfo['messages'] = decryptedMessages;
        }

        let participants = [];
        for (let j = 0; j < chat.participants.length; j++) {

          if (userDoc.id !== chat.participants[j]) {
            let participantInfo = {};

            let info = await User.findOne({ _id: chat.participants[j] }).exec();

            participantInfo['fullname'] = info.fullname;
            participantInfo['email'] = info.email;
            participantInfo['picture'] = info.picture;

            participants.push(participantInfo);
          }

        }

        chatInfo['participants'] = participants;

        chats.push(chatInfo)
      }

      res.send({ serverResponse: "success", chats: chats });
    } else {
      // no contacts
      res.send({ serverResponse: "success", chats: [] });
    }
  }

})

module.exports = router;