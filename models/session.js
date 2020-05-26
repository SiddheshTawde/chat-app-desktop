const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SessionSchema = new Schema({
    _id: String,
    expires: Date,
    session: {
        cookie: {
            originalMaxAge: Number,
            expires: Date,
            secure: Boolean,
            httpOnly: Boolean,
            domain: String,
            path: String,
            sameSite: Boolean
        },
        user: String,
        socketIO: String
    }
}, { collection: 'sessions' })

module.exports = mongoose.model("Session", SessionSchema);