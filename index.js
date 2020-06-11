const express = require('express')
const app = express();

const pusher = require('./pusher')

app.get('/', (req, res) => {
  pusher.trigger('my-channel', 'my-event', {
    'message': `Hello World ${Date.now()}`
  });
  res.status(200).send('')
})

app.listen(9000, () => {
  console.log('listening...')
})
