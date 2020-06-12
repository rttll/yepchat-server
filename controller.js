const pusher = require('./pusher')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ messages: []}).write()

function messages() {
  return db.get('messages')
}

function create(data) {
  
  var entry = { 
    body: data.body,
    user: data.user,
    timestamp: Date.now()
  }

  db.get('messages')
    .push(entry)
    .write() 
        
  pusher.trigger('my-channel', 'my-event', entry);

}

module.exports = {
  create: create,
  messages: messages
}