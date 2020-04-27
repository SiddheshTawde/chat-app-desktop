const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
require('dotenv').config()

const compression = require('compression');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const chatsRouter = require('./routes/chats');

const app = express();

// Using gzip compression
app.use(compression());

//Create HTTP server for socket.io
const server = http.createServer(app);
app.server = server;

//HTTPS redirect middleware
app.use(function (req, res, next) {
    //Heroku stores the origin protocol in a header variable. The app itself is isolated within the dyno and all request objects have an HTTP protocol.
    if (req.get('X-Forwarded-Proto') == 'https' || req.hostname == 'localhost') {
        //Serve Angular App by passing control to the next middleware
        next();
    } else if (req.get('X-Forwarded-Proto') != 'https' && req.get('X-Forwarded-Port') != '443') {
        //Redirect if not HTTP with original request URL
        res.redirect('https://' + req.hostname + req.url);
    }
})

mongoose.connect('mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + '@' + process.env.MONGO_CLUSTER + '-xtz0y.mongodb.net/' + process.env.MONGO_DB + '?retryWrites=true&w=majority', { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
    .then(function () { console.log("Connected to MongoDB Atlas") })
    .catch(function (err) { console.log("Error in connecting to MongoDB Atlast. ", err) })


// Open & Attach Socket.io
const io = require('socket.io')(server);
app.io = io;

io.on('connection', socket => {
    const Chat = require('./models/chat');
    const aes256 = require('aes256');

    const key = process.env.AES_ENCRYP_KEY;

    socket.on('message', data => {
        /*
            Socket.io Events.
     
                When a user sends message - Update their conversation in MongoDB,
                then send full conversation back to both the users
        */
        Chat.findOneAndUpdate({ _id: data.conversationID }, { $push: { messages: aes256.encrypt(key, JSON.stringify(data.message)) } }, { new: true })
            .then(() => io.in(data.conversationID).emit('conversations', 'update conversations'))
    })

    socket.on('subscribe', data => {
        /*
            Socket.io Rooms.
     
                When both users accept chat requests, a new conversation document is created in MongoDB chat collections.
                The ObjectID of that document is used as chat tag for both the users.
        
                Both users refer to same document in chat collections using this tag.
                When either of them sends a message, that message is sent to both using these rooms.
        
                Note: both users need to join room before sending messages.
        */
        socket.join(data.rooms)
    })

    app.socket = socket;
})

// Sessions Store in MongoDB Atlas
let store = new MongoDBStore({
    uri: 'mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + '@' + process.env.MONGO_CLUSTER + '-xtz0y.mongodb.net/' + process.env.MONGO_DB + '?retryWrites=true&w=majority',
    databaseName: 'chat_app',
    collection: 'sessions'
});

store.on('error', function (err) {
    console.log(err)
})

// Express Sessions
app.use(session({
    secret: 'Chat Application',
    cookie: {
        secure: false,
        maxAge: 0
    },
    store: store,
    resave: false,
    saveUninitialized: true
}))

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, '/public')));

/*
    Enable Cross-Origin Resource Sharing

    Only for development
*/
app.use(function (req, res, next) {

    if (process.env.NODE_ENV === 'development') {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Credentials', true)
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
        res.header('Access-Control-Allow-Headers', 'Accept, Content-Type')
    }

    next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chats', chatsRouter);

module.exports = app;