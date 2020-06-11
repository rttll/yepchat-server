const express = require('express')
const app = express();

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

const pusher = require('./pusher')

const production = process.NODE_ENV === 'production';
const origin = production ? process.env.origin : '*'

db.defaults({ messages: []}).write()

function cors(req, res) {
  
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method == 'OPTIONS') {
    res.status(204).send('');
  }

  if (req.get('origin') === origin || !production) {
    return 
  }

  res.status(401)
}

// TODO authorization
app.get('/messages', (req, res) => {
  
  cors(req, res)
  
  res.json(db.get('messages'))
})

app.get('/', (req, res) => {
  
  cors(req, res)

  var body = `Hello World ${Date.now()}`

  db.get('messages')
    .push({ body: body})
    .write()  
  pusher.trigger('my-channel', 'my-event', {
    body: body
  });
  res.status(200).send('')
})

app.listen(9000, () => {
  console.log('listening...')
})
