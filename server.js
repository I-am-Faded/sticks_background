const express = require('express');
const http = require('http');
const createWebSocket = require('./webSocket/ws');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const rooms ={};

const wss = createWebSocket( server, rooms );


app.use(cors());

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

// app.post('/create', (req, res) => {
//   let roomId = generateRoomId();
//   let nickName = req.body.nickName;
//   rooms[roomId] ={players : [ws]}
//   res.json({
//     sessionId: roomId
//   })
// });
//присоединение к комнате
// app.post('/api/join-room', (req, res) => {
//   const roomId = req.body.roomId;
//   const nickName = req.body.nickName;
//   if (roomId && rooms[roomId]) {
//     const player = { name: nickName };
//     rooms[roomId].push(player);
//     res.json({ success: true });
//   } else {
//     res.json({ success: false, message: 'Room not found' });
//   }
// });


// setInterval(()=>{
//   const rooms = 
//   console.log(rooms)
//   // if(rooms[0]){console.log(rooms[0])}
// }, 9000)


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
