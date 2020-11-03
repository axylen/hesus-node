const fs = require('fs');
const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8000);

app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('*', (req, res) => {
  res.redirect('/');
});

function saveToFile() {
  fs.writeFileSync('../hesusappdata', clickCount);
}

function loadFromFile() {
  try {
    const res = fs.readFileSync('../hesusappdata').toString();
    return parseInt(res);
  } catch {
    return 0;
  }
}

let clickCount = loadFromFile();

io.on('connection', (socket) => {
  socket.on('click', (count = 1) => {
    if (count < 1 || count > 20) return;

    clickCount++;
    socket.broadcast.emit('click', clickCount);
  });

  socket.emit('connection', clickCount);
});

setInterval(saveToFile, 5000);
