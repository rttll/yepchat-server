const express = require('express')
const app = express();
const bodyParser = require('body-parser');

const production = process.NODE_ENV === 'production';
const origin = production ? process.env.ORIGIN : '*'

const controller = require(`./controller`)
const pusher = require('./pusher')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

app.use(function(req, res, next) {

  res.header('Content-Type','application/json');
  res.header("Access-Control-Allow-Origin", origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});

app.get('/', (req, res) => {
  res.status(200).send('OK')
})

// TODO authorization
app.get('/index', async (req, res) => {
  var records = await controller.index()
  res.json(records)
})

// TODO authorization
app.post('/create', (req, res) => {
  controller.create(req.body)
  res.status(200).send('')
})

app.post('/login', (req, res) => {
  controller.login(req.body)
  res.status(200).send('')
})

app.post('/pusher/auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  // console.log(socketId, channel)
  var auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 9000;
}
app.listen(port, () => {
  console.log(`Listening on port ${port}... [${process.env.NODE_ENV}]`)
})
