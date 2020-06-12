const pusher = require('./pusher')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const axios = require('axios').default;
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.AIRTABLE_KEY}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const table = `https://api.airtable.com/v0/${process.env.AIRTABLE_TABLE}/messages`

async function index() {
  try {
    var response = await axios.get(table)
    return response.data.records
  } catch (error) {
    console.error(error)
  }
}

function create(data) {
  
  let postData = {
    records: [
      {
        fields: {
          user: data.user,
          body: data.body
        }
      }
    ]
  }

  axios({
    url: table,
    method: 'POST', 
    data: JSON.stringify(postData)
  }).then((resp) => {
    pusher.trigger('my-channel', 'my-event', postData.records[0]);
  }).catch((err) => {
    console.error('no send', err)
  })

}

module.exports = {
  index: index,
  create: create
}