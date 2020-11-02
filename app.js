const io = require('socket.io')();
const fs = require('fs');

function saveToFile() {
  fs.writeFileSync('./data', clickCount);
}
function loadFromFile() {
  try {
    const res = fs.readFileSync('./data').toString();
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
});

setInterval(() => {
  saveToFile();
}, 30000);

io.listen(3000);
