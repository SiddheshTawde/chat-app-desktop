const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    picture: String,
    picture_original: String,
    contacts: [String],
    chats: [String],
    showOnboarding: Boolean,
    onlineStatus: String
}, { collection: "users" })

const User = mongoose.model("User", UserSchema);

module.exports = User;