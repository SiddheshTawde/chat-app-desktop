const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    isGroup: Boolean,
    displayname: String,
    participants: [String],
    messages: [String],
}, { collection: "chats" })

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;