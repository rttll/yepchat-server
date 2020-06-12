const express = require('express')
const app = express();
const bodyParser = require('body-parser');

const controller = require('./controller')

const production = process.NODE_ENV === 'production';
const origin = production ? process.env.origin : '*'

function cors(req, res) { 
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method == 'OPTIONS') {
    console.log('options')  
    res.status(204).send('');
  }
  
  if (req.get('origin') === origin || !production) {
    return 
  }
  
  res.status(401)
}

// app.use(bodyParser);
app.use(express.json()) // for parsing application/json
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// TODO authorization
app.get('/messages', (req, res) => {
  
  cors(req, res)
  var messages = controller.messages()
  
  res.json(messages)
  
})


app.get('/', (req, res) => {

  // cors(req, res)
  var messages = controller.create({body: 'hi', user: 'foo'})
  
  res.json(messages)
  
})

// TODO authorization
app.post('/create', (req, res) => {

  controller.create(req.body)
  res.status(200).send('')

})

app.listen(9000, () => {
  console.log('listening...')
})
