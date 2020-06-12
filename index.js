const express = require('express')
const app = express();

var controllerName = process.env.NODE_ENV === 'production' ? 'controller' : 'controller-dev'
// controllerName = 'controller'
const controller = require(`./${controllerName}`)

const production = process.NODE_ENV === 'production';
const origin = production ? process.env.origin : '*'

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

app.use(express.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// TODO authorization
app.get('/index', async (req, res) => {
  cors(req, res)
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

app.listen(9000, () => {
  console.log('listening...')
})
