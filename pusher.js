var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '1017845',
  key: 'aef48f729c1b993929f3',
  secret: '63723ab70307fb77b034',
  cluster: 'us3',
  encrypted: true
});

module.exports = pusher