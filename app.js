"use strict"

const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const morgan = require('morgan');
const helpers = require('./public/javascript/helpers');
const hbs = require('express-handlebars');

// Import routes
let index = require('./routes/index');

let users = [];

// Template engine setup
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.use('/', index);

// User connects to application
io.on('connection', (socket) => {
   let user;

   socket.on('new user', (data) => {
      user = '';
      socket.username = data.username;
      users[socket.username] = socket;

      user = {
         username: socket.username,
         socketID: socket.id
      };

      users.push(user);
      socket.broadcast.emit('all-users', users);
      console.log(`${socket.username} connected: %s users online`, users.length);
   });

   // Show all users when first logged on
   socket.on('get-users', function (data) {
      socket.emit('all-users', users);
   });

   socket.on('send message', (data) => {
      // Ask bot
      let bot = { response: false };

      if (data.includes("bot")) {
         bot = helpers.botResponse(data);
      }
      io.sockets.emit('new message', { user: user.username, msg: data, bot: bot });
   });

   socket.on('disconnect', () => {
      // Remove user from users array 
      users = helpers.updateUsersArray.removeUser(users, socket.id);
      console.log(`${socket.username} disconnected: %s remaining users online`, users.length);

      socket.broadcast.emit('all-users', users);
   });


});

http.listen(3000, function () {
   console.log('listening on *:3000');
});