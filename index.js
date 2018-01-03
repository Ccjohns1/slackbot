var chatskills = require('chatskills');
var SlackBot = require('slackbots');
require('dotenv').config();
var bot = new SlackBot({token: process.env.BOT_TOKEN, name: process.env.BOT_NAME});

// Set bot name.
chatskills.name(process.env.BOT_NAME);

// Create a new skill.
var hello = chatskills.add('hello');

// Create a new intent.
hello.intent('helloWorld', {
  'slots': {},
  'utterances': ['{to |}{say|speak|tell me} {hi|hello|howdy|hi there|hiya|hi ya|hey|hay|heya}']
}, function(req, res) {
  res.say('Hi everyone! Jesse-B0t has arrived.');
});

// Listen to slack messages.
bot.on('message', function(message) {
  // Reply to humans.
  if (message.type == 'message' && message.text && message.subtype != 'bot_message') {
    var author = getUserById(message.user);
    var channel = getChannelById(message.channel);

    // Respond to input, use author.name as the session id.
    chatskills.respond(message.text, author.name, function(response) {
      if (channel) {
        // Public channel message.
        bot.postMessageToChannel(channel.name, response);
      } else {
        // Private message.
        bot.postMessageToUser(author.name, response);
      }
    });
  }
});

function getUserById(id) {
  return bot.users.filter(function(user) {
    return user.id == id;
  })[0];
}

function getChannelById(id) {
  return bot.channels.filter(function(channel) {
    return channel.id == id;
  })[0];
}
