const express = require('express')
const app = express();

const production = process.NODE_ENV === 'production';

const controller = require(`./controller`)

const origin = production ? process.env.ORIGIN : '*'

app.use(express.json())
app.use(function(req, res, next) {

  res.header('Content-Type','application/json');
  res.header("Access-Control-Allow-Origin", origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});

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

app.get('/', (req, res) => {
  res.status(200).send('OK')
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 9000;
}
app.listen(port, () => {
  console.log(`Listening on port ${port}... [${process.env.NODE_ENV}]`)
})
