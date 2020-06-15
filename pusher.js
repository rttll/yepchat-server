var Pusher = require('pusher');

if (process.env.NODE_ENV = 'development') {
  require('dotenv').config();
}

var pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

module.exports = pusher