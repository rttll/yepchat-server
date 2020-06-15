const pusher = require('./pusher')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ records: []}).write()

function index() {
  return db.get('records')
}

function create(data) {
  var entry = { 
    id: `${Math.round(Math.random() * 100000000000)}`,
    fields: {
      body: data.body,
      user: data.user,
    },
    createdTime: Date.now()
  }

  db.get('records')
    .push(entry)
    .write() 
  
  pusher.trigger('my-channel', 'my-event', entry);

}

module.exports = {
  index: index,
  create: create
}