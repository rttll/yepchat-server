var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '1017845',
  key: '209b4249941e93c213fd',
  secret: 'ba126521aa37196e5c17',
  cluster: 'us3',
  encrypted: true
});

module.exports = pusher