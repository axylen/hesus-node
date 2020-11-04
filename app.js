const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY || path.join(__dirname, 'ssl', 'privateKey.key')),
  cert: fs.readFileSync(process.env.SSL_CERT || path.join(__dirname, 'ssl', 'certificate.crt')),
};

const server = require('https').createServer(httpsOptions, app);
const io = require('socket.io')(server);

server.listen(443);

app.use(express.static(__dirname + '/../frontend'));

app.use(function (req, res, next) {
  if (req.secure) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '../frontend' });
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

const http = require('http');
http.createServer(app).listen(80);
