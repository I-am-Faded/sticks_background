const { json } = require('express');
const WebSocket = require('ws');
const { PrismaClient } = require('@prisma/client');

// function createWebSocket (server, rooms){
//    const wss = new WebSocket.Server({server});

//    wss.on('connection', (ws) => {
//     console.log('connected')
//     ws.on('message', (message) => {
//       const parsedMessage = JSON.parse(message);
  
//       if (parsedMessage.type === 'create-room') {
//         const roomId = generateRoomId();
//         rooms[roomId] = {
//           playersCount: parsedMessage.playersCount,
//           currentTurn: 0,
//           players: [ws],
//           nickName: [parsedMessage.nickName],
//           move : [],
//           numRows: parsedMessage.numRows,
//         };
  
//         // Отправка идентификатора комнаты обратно клиенту
//         ws.send(JSON.stringify({
//           type: 'room-created',
//           roomId,
//         }));
//       }

//        else if (parsedMessage.type === 'join-room') {
//         const roomId = parsedMessage.roomId;
        

//         if (rooms[roomId]  && rooms[roomId].players && rooms[roomId].players.length < rooms[roomId].playersCount) {
//           rooms[roomId].players.push(ws);
//           rooms[roomId].nickName.push(parsedMessage.nickName);
//           // Отправка сообщения об успешном присоединении
//           ws.send(JSON.stringify({
//             type: 'room-joined',
//             roomId,
//           }));
  

//           // Отправка сообщения всем участникам комнаты о новом игроке
//           const players = rooms[roomId].players;
//           players.forEach((player) => {
//             if (player !== ws) {
//               player.send(JSON.stringify({
//                 type: 'new-player-joined',
//                 nickName: rooms[roomId].nickName,
//               }));
//             }
//           });
//         }
//          else {
//           // Отправка сообщения об ошибке присоединения
//           ws.send(JSON.stringify({
//             type: 'room-error',
//             message: 'Room is full or does not exist',
//           }));
//         }
//       }
//       // else if(parsedMessage.type ==='createId'){
//       //   const roomId = parsedMessage.roomId
//       //   const playerId = rooms[roomId].players.length;
//       //   const currentTurn =rooms[roomId].currentTurn;

//       //   console.log('createId', playerId, currentTurn);
//       //   ws.send(JSON.stringify({
//       //     type: 'createId',
//       //     playerId,
//       //     currentTurn,
//       //   }))
//       // }
      
//       else if (parsedMessage.type === 'player-move') {
//         const { roomId, playerId, move } = parsedMessage;
//         const room = rooms[roomId];
//         const moveExists = (rowIndex, columnIndex, direction, moves) => {
//           return moves.some(move => 
//             move.rowIndex === rowIndex && 
//             move.columnIndex === columnIndex && 
//             move.direction === direction
//           );
//         };
//         const checkSides = (rowIndex, columnIndex, sides, moves) => {
//           return sides.every(side => moveExists(rowIndex, columnIndex, side, moves));
//         };
//         const {rowIndex, columnIndex, direction} =move;
//         rooms[roomId].move.push(move);

//         let isCurrentSquareCompleted =rowIndex ==0? checkSides(rowIndex, columnIndex, ['top','bottom', 'left'], rooms[roomId].move)&&(moveExists(rowIndex,columnIndex +1,'left',rooms[roomId].move)||moveExists(rowIndex,columnIndex,'right',rooms[roomId].move)):
//         checkSides(rowIndex, columnIndex, ['bottom', 'left'], rooms[roomId].move)&&moveExists(rowIndex-1,columnIndex,'bottom',rooms[roomId].move)&&(moveExists(rowIndex,columnIndex +1,'left',rooms[roomId].move)||moveExists(rowIndex,columnIndex,'right',rooms[roomId].move));

//         let isNeighborSquareCompleted = false;
//         if(
//           direction === 'left' && columnIndex > 0
//         ){isNeighborSquareCompleted = rowIndex ==0? checkSides(rowIndex, columnIndex - 1, ['top','bottom', 'left'], rooms[roomId].move)&&moveExists(rowIndex,columnIndex,direction,rooms[roomId].move):
//           checkSides(rowIndex, columnIndex - 1, ['bottom', 'left'], rooms[roomId].move)&&moveExists(rowIndex,columnIndex,direction,rooms[roomId].move)&&moveExists(rowIndex - 1,columnIndex-1,'bottom',rooms[roomId].move);
//         }
//         if(direction === 'bottom' && rowIndex < rooms[roomId].numRows - 1){
//           isNeighborSquareCompleted = checkSides(rowIndex + 1, columnIndex, ['bottom', 'left'], rooms[roomId].move)&&(moveExists(rowIndex + 1,columnIndex + 1,'left',rooms[roomId].move)||moveExists(rowIndex + 1,columnIndex,'right',rooms[roomId].move))&&moveExists(rowIndex,columnIndex,'bottom',rooms[roomId].move)

//         }
//         if(!isCurrentSquareCompleted && !isNeighborSquareCompleted){
//         room.currentTurn = (room.currentTurn + 1) % room.players.length;
//         }else{isNeighborSquareCompleted = false}

//         console.log(
//           // `current ${isCurrentSquareCompleted}`, `neigbord ${isNeighborSquareCompleted}`
//           !!rooms[roomId], !!rooms[roomId].players);

//         rooms[roomId].move.push(move);
//         console.log('send move from server')

//         if (rooms[roomId] && rooms[roomId].players) {
//           rooms[roomId].players.forEach((player) => {
//             // if (player !== ws) {
//               player.send(JSON.stringify({
//                 type: 'player-move',
//                 move,
//                 currentTurn: room.currentTurn,
//               }));
//             // }
//           });
//         }
//       }
//       else if(parsedMessage.type === 'getNickName'){
//         const roomId = parsedMessage.roomId;
//         const nickName =  [] &&rooms[roomId].nickName;
//         if(!rooms[roomId].players.includes(ws)){
//           rooms[roomId].players.push(ws)
//         }
       
//       ws.send(JSON.stringify({type: 'getNickName', nickName}));

//       }
    //   else if (parsedMessage.type === 'sync-moves'){
    //   // Отправка всех сделанных ходов новому игроку
    //   const roomId = parsedMessage.roomId
    //   const playerId = rooms[roomId].players.length - 1;
    //   const currentTurn =rooms[roomId].currentTurn;
    //   // const nickName = rooms[roomId].nickName;
      
    //   ws.send(JSON.stringify({
    //     type: 'sync-moves',
    //     move: rooms[parsedMessage.roomId].move,
    //     playerId,
    //     // nickName,
    //     currentTurn,
    //   }));
    // }
    // });
  
//     ws.on('close', () => {
//       for (const roomId in rooms) {
//         const room = rooms[roomId];
//         const playerIndex = room.players.indexOf(ws);
//         if (playerIndex !== -1) {
//           room.players.splice(playerIndex, 1);
//           // room.nickName.splice(playerIndex, 1);
//           console.log(`Player removed from room ${roomId}`);
//           break;
//         }
//       }
//       // Логика обработки закрытия соединения
//       // if (roomId && rooms[roomId]) {
//         // Удаление игрока из комнаты при отключении
//         // rooms[roomId] = rooms[roomId].filter((player) => player !== ws);
//       // }
//     });
//   });

//   return wss
// }

// // Генерация уникального идентификатора комнаты
// function generateRoomId() {
//   return Math.random().toString(36).substring(2, 8);
// }

// module.exports = createWebSocket;



//  при обновление иговой страницы нужно добавить игрока соединение и ник на сервер в комнату 

const roomDeletionTimers = new Map();
const prisma = new PrismaClient();
const playerConnections = new Map(); // Ключом будет playerId, значением — WebSocket соединение.

async function createWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    ws.on('message', async (message) => {
      const parsedMessage = JSON.parse(message);
      const randoms = generateRoomId(); 
      if (parsedMessage.type === 'create-room') {
        const room = await prisma.room.create({
          data: {
            roomId: randoms,
            playersCount: parsedMessage.playersCount,
            numRows: parsedMessage.numRows,
            numColumns: parsedMessage.numColumns,
            typeBoard: parsedMessage.typeBoard,
          },
        });
        // const roomReq = await prisma.room.findUnique({})
        const player = await prisma.player.create({
          data: {
            nickName: parsedMessage.nickName,
            sessionId: parsedMessage.playerSessionId,
            roomId: room.id,
          },
        });
        // Сохраняем WebSocket-соединение игрока в Map
        playerConnections.set(player.id, ws);

        ws.send(JSON.stringify({ type: 'room-created', roomId: room.roomId}));
        // ws.send(JSON.stringify({ type: 'get-id', playerId: player.id }));

      }

      else if (parsedMessage.type === 'join-room') {
        const room = await prisma.room.findUnique({
          where: { roomId: parsedMessage.roomId },
          include: { players: true },
        });

        if (room && room.players.length < room.playersCount) {
          const player = await prisma.player.create({
            data: {
              nickName: parsedMessage.nickName,
              sessionId: parsedMessage.playerSessionId,
              roomId: room.id,
              playerOrder: room.players.length, 
              score: 0,
              // room: { connect: { id: room.id } },
            },
          });
          playerConnections.set(player.id, ws);

          // const updatedRoom =await prisma.room.findUnique({
          //   where: { roomId: parsedMessage.roomId },
          //   include: { players: true },
          // });

          ws.send(JSON.stringify({ type: 'room-joined', roomId: room.roomId }));
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: 'new-player-joined',
                  score: [...room.players.map(p=> [p.playerOrder,p.score]), [player.playerOrder,player.score]],
                  nickName: [...room.players.map(p => [p.playerOrder, p.nickName]), [player.playerOrder,player.nickName]],
                })
              
              );
            }
          });
          // const moves = await prisma.move.findMany({
          //   where: { roomId: room.id },
          // });

          // Отправляем игроку все текущие ходы и ID игрока
          // ws.send(JSON.stringify({
          //   type: 'sync-moves',
          //   moves,
          //   playerId: player.id,
          //   currentTurn: room.currentTurn,
          // }));
        } else {
          ws.send(JSON.stringify({ type: 'room-error', message: 'Room is full or does not exist' }));
        }
      }

      else if (parsedMessage.type === 'player-move') {
        const { roomId, move } = parsedMessage;
        const {rowIndex, columnIndex, direction} = move;
        const room = await prisma.room.findUnique({
          where: { roomId: roomId },
          include: { moves: true, players: true,  },
        });

        
          await prisma.move.create({
            data: {
              rowIndex: move.rowIndex,
              columnIndex: move.columnIndex,
              direction: move.direction,
              room: { connect: { id: room.id } },
            },
          });
         
          const updatedRoom = await prisma.room.findUnique({
            where: { id: room.id },
            include: { moves: true, players: true, },
          });
          room.moves = updatedRoom.moves;
          // room.moves.push({
          //   rowIndex: move.rowIndex,
          //   columnIndex: move.columnIndex,
          //   direction: move.direction,
          // });

          let nextTurn = (room.currentTurn + 1) % room.players.length;
                    const moveExists = (rowIndex, columnIndex, direction, moves) => {
                          return moves.some(move =>
                            move.rowIndex === rowIndex &&
                            move.columnIndex === columnIndex &&
                            move.direction === direction
                          );
                        };
                    const isSquareCompleted = (rowIndex, columnIndex, moves) => {
                      if(room.typeBoard == 'square'){
                      const topExists = rowIndex === 0
                        ? moveExists(rowIndex, columnIndex, 'top', moves)
                        : moveExists(rowIndex - 1, columnIndex, 'bottom', moves);
                    
                      const leftExists = moveExists(rowIndex, columnIndex, 'left', moves);
                    
                      const rightExists = columnIndex === room.numColumns - 1
                        ? moveExists(rowIndex, columnIndex, 'right', moves)
                        : moveExists(rowIndex, columnIndex + 1, 'left', moves);
                    
                      const bottomExists = moveExists(rowIndex, columnIndex, 'bottom', moves)
                      return topExists && leftExists && rightExists && bottomExists;

                      }
                      else{
                        let topExists = false;
                        let rightExists= false;
                        // if( rowIndex +1 <=(Math.floor(room.numRows/2)) ){
                        // topExists = rowIndex === 0 ||(rowIndex +1 <= (Math.floor(room.numRows/2)) &&(columnIndex == 0 ||columnIndex == ((rowIndex *2)+ 1)))
                        // ? moveExists(rowIndex, columnIndex, 'top', moves)
                        // : moveExists(rowIndex - 1, columnIndex -1 , 'bottom', moves);

                        // rightExists = columnIndex === ((rowIndex *2)+ 1)
                        // ? moveExists(rowIndex, columnIndex, 'right', moves)
                        // : moveExists(rowIndex, columnIndex + 1, 'left', moves);
                    
                        // }
  
                          if(room.numRows % 2 == 0){
                            if( rowIndex +1 <=(Math.floor(room.numRows/2)) ){
                              topExists = rowIndex === 0 ||(rowIndex +1 <= (Math.floor(room.numRows/2)) &&(columnIndex == 0 ||columnIndex == ((rowIndex *2)+ 1)))
                              ? moveExists(rowIndex, columnIndex, 'top', moves)
                              : moveExists(rowIndex - 1, columnIndex -1 , 'bottom', moves);
      
                              rightExists = columnIndex === ((rowIndex *2)+ 1)
                              ? moveExists(rowIndex, columnIndex, 'right', moves)
                              : moveExists(rowIndex, columnIndex + 1, 'left', moves);
                            }
                            else{
                              topExists = rowIndex +1 == ((Math.floor(room.numRows / 2)) +1)? 
                              moveExists(rowIndex - 1, columnIndex , 'bottom', moves)
                              :moveExists(rowIndex - 1, columnIndex + 1 , 'bottom', moves);

                              rightExists = columnIndex === (((room.numRows - rowIndex) *2) - 1)
                              ? moveExists(rowIndex, columnIndex, 'right', moves)
                              : moveExists(rowIndex, columnIndex + 1, 'left', moves);
                            }
                          }


                          else{
                            if( rowIndex +1 <=(Math.floor(room.numRows/2)) ){
                              topExists = ((rowIndex === 0) ||(columnIndex == 0 ||columnIndex == ((rowIndex *2)+ 2)))
                              ? moveExists(rowIndex, columnIndex, 'top', moves)
                              : moveExists(rowIndex - 1, columnIndex -1 , 'bottom', moves);
      
                              rightExists = (columnIndex == ((rowIndex *2)+ 2))
                              ? moveExists(rowIndex, columnIndex, 'right', moves)
                              : moveExists(rowIndex, columnIndex + 1, 'left', moves);
                            }
                            else{
                            topExists = (rowIndex +1 == ((Math.floor(room.numRows / 2)) +1))||(rowIndex + 1 ==((Math.floor(room.numRows / 2)+ 2) ))? 
                            moveExists(rowIndex - 1, columnIndex , 'bottom', moves)
                            :moveExists(rowIndex - 1, columnIndex + 1 , 'bottom', moves);
                            
                            rightExists = columnIndex === ((room.numRows - rowIndex) *2) || columnIndex == room.numRows -1 
                            ? moveExists(rowIndex, columnIndex, 'right', moves)
                            : moveExists(rowIndex, columnIndex + 1, 'left', moves);
                            }
                          }
                         

                        
                      const leftExists = moveExists(rowIndex, columnIndex, 'left', moves);
                    
                 
                    
                      const bottomExists = moveExists(rowIndex, columnIndex, 'bottom', moves)
                       
                     
                        
                      return topExists && leftExists && rightExists && bottomExists;
                        
          
                      }
                    };

                    let isCurrentSquareCompleted = isSquareCompleted(rowIndex, columnIndex, room.moves);


                    let isNeighborSquareCompleted = false;
                    if (direction === 'left' && columnIndex > 0) {
                      isNeighborSquareCompleted = isSquareCompleted(rowIndex, columnIndex - 1, room.moves);
                    }
                    // if (direction === 'bottom' && rowIndex < room.numRows - 1) {
                    //   isNeighborSquareCompleted = isSquareCompleted(rowIndex + 1, columnIndex, room.moves);
                    // }
                    if(room.typeBoard == 'square'){
                      if (direction === 'bottom' && rowIndex < room.numRows - 1) {
                          isNeighborSquareCompleted = isSquareCompleted(rowIndex + 1, columnIndex, room.moves);
                        }
                    }

                    else{
                    if (direction === 'bottom' && rowIndex +1 <= room.numRows /2 && room.numRows %2 ==0) {
                        isNeighborSquareCompleted =rowIndex + 1 == room.numRows/2 ?
                        isSquareCompleted(rowIndex + 1, columnIndex, room.moves)
                        :isSquareCompleted(rowIndex + 1, columnIndex + 1, room.moves);
                      }
                      else if(direction === 'bottom' && ((rowIndex +1 <= Math.floor(room.numRows /2))||(rowIndex + 1 == Math.floor(room.numRows /2) +1))){
                        isNeighborSquareCompleted =(rowIndex + 1 == Math.floor(room.numRows/2)) ||(rowIndex + 1 == Math.floor(room.numRows /2) +1)
                        ?isSquareCompleted(rowIndex + 1, columnIndex, room.moves)
                        :isSquareCompleted(rowIndex + 1, columnIndex + 1, room.moves);
                      }
                      else if (direction === 'bottom' && rowIndex  < room.numRows - 1) {
                        isNeighborSquareCompleted = isSquareCompleted(rowIndex + 1, columnIndex-1, room.moves);
                      }
                    }

                    if(isCurrentSquareCompleted && isNeighborSquareCompleted){
                    const player = room.players.find((p)=>{return p.playerOrder === room.currentTurn});
                    
                
                    await prisma.player.update({
                      where: { id: player.id },
                      data: { score: player.score+2 },
                    });
                    isNeighborSquareCompleted = false;
                    nextTurn = room.currentTurn;
                
                    }else if(isCurrentSquareCompleted || isNeighborSquareCompleted){
                      const player = room.players.find((p)=>{return p.playerOrder === room.currentTurn});

                     await prisma.player.update({
                      where: { id:player.id },
                      data: { score: player.score+1 },
                      });
                      isNeighborSquareCompleted = false;
                      nextTurn = room.currentTurn;
                     }
                    else {
                      await prisma.room.update({
                        where: { id: room.id },
                        data: { currentTurn: nextTurn },
                      });
                    }          

                    const updatedScore = await prisma.room.findUnique({
                      where: { id: room.id },
                      include: { moves: true, players: true },
                    });
                    const score = updatedScore.players.map((player) =>{return [player.playerOrder, player.score]});
                      // player =>{return  Object(player.playerOrder , player.score)});

                    room.players.forEach((player) => {
                      const playerWs = playerConnections.get(player.id);
          
                      if (playerWs && playerWs.readyState === WebSocket.OPEN ) {
                        playerWs.send(JSON.stringify({
                          type: 'player-move',
                          move,
                          score: score,
                          currentTurn: nextTurn,
                        }));
                      }
                    });
      

                    // Запросим всех игроков в комнате и вычислим их общий счёт
                    const playersInRoom = await prisma.player.findMany({
                      where: {
                        roomId: room.id,
                      },
                    });
                    const totalScore = playersInRoom.reduce((acc, player) => acc + player.score, 0);
                    // Найти максимальный счёт
                    const maxScore = Math.max(...playersInRoom.map(player => player.score));

                    // Найти всех игроков с максимальным счётом
                    const topPlayers = playersInRoom.filter(player => player.score === maxScore);

                    if(room.typeBoard =='square' && totalScore ==calculateSquareCells(room.numRows, room.numColumns) ){
                      room.players.forEach((player) => {
                        const playerWs = playerConnections.get(player.id);
            
                        if (playerWs && playerWs.readyState === WebSocket.OPEN ) {
                          playerWs.send(JSON.stringify({
                            type: 'game-end',
                            topPlayers: topPlayers,
                          }));
                        }
                      });
                    }
                    else if(room.typeBoard =='diamond'  && totalScore ==calculateDiamondCells(room.numRows)){
                      room.players.forEach((player) => {
                        const playerWs = playerConnections.get(player.id);

            
                        if (playerWs && playerWs.readyState === WebSocket.OPEN ) {
                          playerWs.send(JSON.stringify({
                            type: 'game-end',
                            topPlayers: topPlayers,
                          }));
                        }
                      });
                    }
//////  /////////////////////////////////////////

        //   const nextTurn = (room.currentTurn + 1) % room.players.length;
        //   // const currentTurn = room.players[nextTurn].id;

        //   await prisma.room.update({
        //     where: { id: room.id },
        //     data: { currentTurn: nextTurn },
        //   });

        //   room.players.forEach((player) => {
        //     const playerWs = playerConnections.get(player.id);

        //     if (playerWs && playerWs.readyState === WebSocket.OPEN ) {
        //       playerWs.send(JSON.stringify({
        //         type: 'player-move',
        //         move,
        //         currentTurn: nextTurn,
        //       }));
        //     }
        //   });
        // }
        // else{
        //   console.log('while maked move room not found')
        // }
      }
      else if (parsedMessage.type === 'getNickName') {
        const { roomId } = parsedMessage;
        const room = await prisma.room.findUnique({
          where: { roomId: roomId },
          select: {players: true}
        });
        if(room &&room.players){
        const nicknames = room.players.map(player => [player.playerOrder, player.nickName]);
        const score = room.players.map(player => [player.playerOrder, player.score]);
        ws.send(JSON.stringify({
          type:'getNickName',
          nickName: nicknames,
          score: score,
        }))
        }
      }
      else if (parsedMessage.type === 'sync-moves') {
        const { roomId, playerSessionId, nickName } = parsedMessage;
        
        const room = await prisma.room.findUnique({
          where: { roomId },
          select: { players: true, currentTurn: true, moves: true, typeBoard: true, numRows:true , numColumns:true },
        });        
        if(room){
        let player = room.players.find(player => player.sessionId === playerSessionId);
        
        // await prisma.player.findUnique({
        //   where: { sessionId: playerSessionId },
        // });
        

        if ( player && player.isActive == false) {
          // Игрок найден, делаем его активным
          await prisma.player.update({
            where: { id: player.id },
            data: { isActive: true },
          });
          playerConnections.set(player.id, ws);
          const timer = roomDeletionTimers.get(player.roomId);
          if (timer) {
            clearTimeout(timer);
            roomDeletionTimers.delete(player.roomId);
            console.log(`Room ${roomId} deletion canceled due to reconnecting player.`);
          }
        } else {
          // Создаем нового игрока
          // player = await prisma.player.create({
          //   data: {
          //     sessionId: playerSessionId,
          //     roomId,
          //     nickName: nickName || 'Player',
          //     isActive: true,
          //   },
          // });
          console.log('sync-moves : player sessionId not found')
        }
        
        if(player){
        const playerId = player.playerOrder;
        // const currentTurn = room.players[room.currentTurn].id;
        const move = room.moves;
    
        ws.send(JSON.stringify({
          type: 'sync-moves',
          move,
          playerId,
          numRows:room.numRows,
          numColumns:room.numColumns,
          currentTurn: room.currentTurn,
          typeBoard: room.typeBoard,
        }));
        }

        if (roomDeletionTimers.has(roomId)) {
          clearTimeout(roomDeletionTimers.get(roomId));
          roomDeletionTimers.delete(roomId);
        }

        // const moves = await prisma.move.findMany({
        //   where: { roomId },
        // });
        // const room = await prisma.room.findUnique({
        //   where: { roomId: roomId },
        //   select: { players: true, currentTurn:true, moves:true }, // Включаем игроков в запрос
        // });

          // select: { currentTurn: true },

        // const player = await prisma.player.findUnique({
        //   where: { roomId: roomId },
        // });
        
        // const playerId = room.players[room.players.length - 1].id;
        // const currentTurn = room.players[room.currentTurn].id;
        // const move = room.moves;
        // playerConnections.set(playerId, ws);

        
        // ws.send(JSON.stringify({
        //   type: 'sync-moves',
        //   move,
        //   playerId,
        //   currentTurn: currentTurn,
        // }));
      
      }
      }

       else {
      }
    });

    async function handleDisconnect(ws) {
      const playerId = [...playerConnections.entries()]
        .find(([, connection]) => connection === ws)?.[0];
      if (playerId) {
        const player = await prisma.player.findUnique({ where: { id: playerId } });

        if (player) {
          const roomId = player.roomId;

        // Обновляем статус игрока на неактивен
        await prisma.player.update({
          where: { id: playerId },
          data: { isActive: false },
        });
        
    
        // Удаляем соединение игрока из playerConnections
        playerConnections.delete(playerId);
      
    
      
        const room = await prisma.room.findUnique({
          where: { id: roomId },
          include: { players: true },
        });
    
        // const activePlayers = room.players.some(player => player.isActive);
    
        if (room && !room.players.some(player => player.isActive)) {
          // Запускаем таймер на удаление комнаты, если нет активных игроков
          console.log(`No active players in room ${roomId}. Starting deletion timer.`);
          const timer = setTimeout(async () => {
            // console.log(`Deleting room ${roomId}.`);
            // await prisma.room.delete({ where: { id:roomId } });
            // roomDeletionTimers.delete(roomId);
            // console.log(`Room ${roomId} has been deleted.`);
            try {
              console.log(`Deleting all related players and moves for room ${roomId}.`);
          
              // Удаляем комнату
              await prisma.room.delete({
                where: { id:roomId },
              });
          
              console.log(`Room ${roomId} has been successfully deleted.`);
              roomDeletionTimers.delete(roomId);
            } catch (error) {
              console.error(`Error deleting room ${roomId}:`, error);
            }
          },
          //  10 * 60 * 1000
          10000
          
           ); // 5 минут
    
          // Сохраняем таймер для комнаты
          roomDeletionTimers.set(roomId, timer);
        }else{
          console.log(`Room ${roomId} still has active players.`);
        }
      }
      }
    }

    ws.on('close', async () => {
    //   const playerId = [...playerConnections.entries()]
    // .find(([, connection]) => connection === ws)?.[0];

    // const player = playerId ? await prisma.player.findUnique({ where: { id: playerId } }) : null;
    // const roomId = player ? player.roomId : null;
    
      await handleDisconnect(ws);
      await prisma.$disconnect();
      // playerConnections.forEach((connection,playerId ) => {
      //   if (connection === ws) {
      //     playerConnections.delete(playerId);
      //   }
      // });
    });
  });


  return wss;
}

function calculateSquareCells(numRows, numColumns) {
  let cells = numRows * numColumns;

  return cells;
}

function calculateDiamondCells(numRows) {
  let cells = 0;

  const rowsBeforeCenter = Math.floor(numRows / 2); // Ряды до центра
  const midPoint = Math.ceil(numRows / 2); // Середина доски (включительно для нечётного числа рядов)
  let startCells = (numRows % 2 === 0) ? 2 : 3; // Начало с 2 или 3 клеток

  // Верхняя половина (включая середину)
  for (let i = 0; i < rowsBeforeCenter; i++) {
    cells += startCells + 2 * i; // Увеличение на 2 клетки в каждом ряду
  }

  // Нижняя половина (симметрия)
  for (let i = midPoint - 2; i >= 0; i--) {
    cells += startCells + 2 * i;
  }
  if(numRows %2 ==0){
  return cells;//37
  }
  else{
    return cells + rowsBeforeCenter * 2 + 1;
  }
}


// setInterval(async() => {

//   const resulut= await prisma.room.findMany({
//     include: {
//           players : true,
//           // moves:true,
//             // Включить информацию о ходах
//     }
//   })

//   // console.log(roomDeletionTimers)
//   // console.log('Current playerConnections:', [...playerConnections.keys()]);
// }, 3000);


function generateRoomId() {
  const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomPart}`;
  // return Math.random().toString(36).substring(2, 8);
}

module.exports = createWebSocket;

