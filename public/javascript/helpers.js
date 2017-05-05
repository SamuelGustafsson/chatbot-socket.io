"use strict"

let helpers = {
   getMonthString: (num) => {
      let monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return monthsArr[num];
   },
   getDayString: (num) => {
      let daysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return daysArr[num];
   },
   updateUsersArray: {
      removeUser: (usersArr, socketID) => {
         return usersArr.filter(function (user) {
            return user.socketID !== socketID;
         });
      },
   },
   botResponse: (message) => {
      let date = new Date();
      let bot = {};

      if (message === "bot -time") {
         bot.message = "The time is " + date.getHours() + ":" + date.getMinutes();
         bot.response = true;
      }

      else if (message === "bot -day") {
         bot.message = `It is ${helpers.getDayString(date.getDay())}`;
         bot.response = true;
      }

      else if (message === "bot -year") {
         bot.message = `It is ${date.getFullYear()}`;
         bot.response = true;
      }

      else if (message === "bot -fulldate") {
         bot.message = `It is ${date.getDate()} ${helpers.getMonthString(date.getMonth())} ${date.getFullYear()}`;
         bot.response = true;
      }

      else if (message === "bot -commands") {
         bot.message = "The bot commands are: -time -fulldate -day -year";
         bot.response = true;
      }

      else {
         bot.message = "Unfortunately, I can not answer your question";
         bot.response = true;
      }
      return bot;
   }

}

module.exports = helpers;