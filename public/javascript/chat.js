
$(function () {
  var socket = io.connect();

  // User register variables
  $loginArea = $('#loginArea');
  $loginForm = $('#loginForm');
  $users = $('#users');
  $username = $('#username');

  // Chat-area variables
  var $chatForm = $('#chatForm');
  var $chatMessage = $('#message');
  var $chat = $('#chat-window');
  var $chatArea = $('#chatArea');
  $welcomeMessage = $(".welcome-message");
  var usersArr = [];

  $loginForm.submit(function (e) {
    e.preventDefault();

    socket.username = $username.val();

    socket.emit('new user', { username: socket.username });
    $username.val('');

    $loginArea.hide();
    $chatArea.show();
    $welcomeMessage.text(`Welcome to the Chatroom ${socket.username}`);


  });

  socket.emit('get-users');

  socket.on('all-users', (data) => {
    $(".user").remove();

    usersArr = data.filter((user) => {
      console.log(localStorage.username);
      return user.username !== socket.username;
    });

    if (usersArr.length > 0) {
      usersArr.forEach(function (user) {
        $users.append(`<div class="well user"><span>${user.username}</span></div>`);
      }, this);
    }
  });

  $chatForm.submit(function (e) {
    e.preventDefault();

    // Send message to server.
    socket.emit('send message', $chatMessage.val());
    $chatMessage.val('');
  });

  // Display messages to client
  socket.on('new message', (data) => {
    $chat.append(`<div class="well"><span>${data.user}:</span> ${data.msg}</div>`);

    if (data.bot.response) {
      $chat.append(`<div class="well"><span>Bot:</span> ${data.bot.message}</div>`);
    }

  });

});
