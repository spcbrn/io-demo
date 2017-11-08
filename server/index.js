
require('dotenv').config();

const express = require('express')
    , http = require('http')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , socket = require('socket.io');

const app = express();
const io = socket(app.listen(3005, () => console.log('Serving PORT: 3005')));

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());
app.use(express.static(__dirname + '/build'));

app.get('/hello/world', (req, res) => {
  res.status(200).send('Hello, World!')
});

app.get('/', (req, res) => {
  res.send('Fine');
})

app.post('/', (req, res) => {
  const {Body, From, MediaUrl0} = req.body;
  const message = {
    body: Body,
    from: From,
    img: MediaUrl0
  };
  io.emit('message', message)
  res.send(`
            <Response>
              <Message>Thanks for texting!</Message>
            </Response>
          `)
});

io.on('connection', (socket) => {
  console.log(socket.id + ' connected');
  socket.on('message', (body) => {
    console.log('new message: \"' + body + '\"');
    socket.broadcast.emit('message', {
      body,
      from: socket.id.slice(8)
    })
  })
})
