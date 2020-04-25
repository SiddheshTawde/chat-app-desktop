
# Chat Application

### About
 
A simple chat application for Desktop.

### Concept
 
![Architecture](https://raw.githubusercontent.com/SiddheshTawde/chat-app/master/contents/Architecture.jpg)
 
 
## Getting Started

The application uses MongoDB as database. Hence you will require either the cloud implementation of MongoDB OR you can use the local implementation of MongoDB.

### Prerequisites
 - Node.js & npm
 - MongoDB
 - .env file

Create an env file in this format:

MONGO_USER=***database username***
MONGO_PASSWORD=***database password***
MONGO_CLUSTER=***MongoDB cluster***
MONGO_DB=***database***
AES_ENCRYP_KEY=***encryption key***

Place this file in root directory of the project.

### Installing

Installing dependencies

```
git clone https://github.com/SiddheshTawde/chat-app.git
cd chat-app-desktop
npm install && cd client && npm install
```
---
#### Node server
Node server will run on port 5000. The Production ready application will also run on port 5000.
```
npm start
```
#### React dev server
For Development purpose, you will need to run both Node and react dev server.

The React dev server will run on port 3000.

```
npm run dev
```
---
#### Production build
Production ready build provided by create-react-app
```
cd client && npm run build
```
*Note: Production build is not included here.*

## Built With

* [React.js](https://reactjs.org/) - The web framework used
* [Redux](https://redux.js.org/) - State Management
* [Express / Express generator](https://expressjs.com/) - Server side implementation
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud Database
* [Socket.io](https://socket.io/) - Real-Time engine
* [React Spring](https://www.react-spring.io/) - Primary Animation Library

## Author

 #### Siddhesh Tawde - [Email](mailto:siddheshtawde35@gmail.com)

This application is built for the sole purpose of practicing programming, following best practices & learn new technologies in web development.

This application is NOT complete & some of the features still require a some design & development solutions.