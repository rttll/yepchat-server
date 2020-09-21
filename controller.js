const pusher = require('./pusher')
const production = process.env.NODE_ENV === 'production';

let db;

if (!production) {
  require('dotenv').config();
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  const adapter = new FileSync('db.json')
  db = low(adapter)
  db.defaults({ records: [], users: [] }).write()
}

if (production) {
  const axios = require('axios').default;
  axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.AIRTABLE_KEY}`;
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  const table = `https://api.airtable.com/v0/${process.env.AIRTABLE_TABLE}/messages`
}  

async function index() {
  // Dev
  if (!production) {
    return db.get('records')
  }

  // Production
  try {
    var response = await axios.get(table)
    return response.data.records.map(r => {
      r
    })
  } catch (error) {
    console.error(error)
  }
}

function create(data) {

  let postData = {
    records: [
      {
        fields: {
          body: data.body,
          user: {
            name: data.user.name,            
            avatar: data.user.avatar
          }
        }
      }
    ]
  }

  // Dev
  if (!production) {

    var entry = { 
      id: `${Math.round(Math.random() * 100000000000)}`,
      fields: postData.records[0].fields,
      createdTime: Date.now()
    }

    db.get('records')
    .push(entry)
    .write() 
  
    pusher.trigger('private-yepchat', 'new-chat', entry, data.socket);
    return
  }

  // Production
  axios({
    url: table,
    method: 'POST', 
    data: JSON.stringify(postData)
  }).then((resp) => {
    // console.log(data.socket)
    pusher.trigger('private-yepchat', 'new-chat', postData.records[0], data.socket);
  }).catch((err) => {
    console.error('no send', err)
  })

}

function login(data) {

  let postData = {
    users: [
      {
        fields: {
          name: data.name,
          avatar: data.avatar
        }
      }
    ]
  }

  // Dev
  if (!production) {

    var entry = { 
      id: `${Math.round(Math.random() * 100000000000)}`,
      fields: postData.users[0].fields,
      createdTime: Date.now()
    }

    db.get('users')
    .push(entry)
    .write() 
    return
  }
  
  // Production
  // axios({
  //   url: table,
  //   method: 'POST', 
  //   data: JSON.stringify(postData)
  // }).then((resp) => {
  //   console.log('made login')
  // }).catch((err) => {
  //   console.error('no send', err)
  // })

}

module.exports = {
  index: index,
  create: create,
  login: login
}