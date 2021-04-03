const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 1000;
const io = require('socket.io')(http);
app.use(express.static(__dirname+'/public'))
http.listen(PORT,()=>{
   console.log(`Chat App Server is listening on port ${PORT}`) 
});
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
});


const users = {};

io.on('connection',(socket)=>{
  
    socket.on('sentmsg',(msg)=>{
        socket.broadcast.emit('msgbroadcast',msg)
    })
    socket.on('userconnected', async(username)=>{
        users[socket.id] = username;
       await socket.broadcast.emit('userconnected',username)
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('userdisconnected',users[socket.id])
    })
})
