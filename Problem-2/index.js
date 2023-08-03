import express from 'express'
const app = express()
import {createServer} from 'http'
const server = createServer(app)
import { Server } from 'socket.io'
const io = new Server(server)

io.on('connection',(socket) => {
    console.log('connected!')
    socket.on("chat-add", (msg) => {
        console.log("message: " + msg);
        socket.broadcast.emit("chat message", msg);
      });
})


app.get("/", (req, res) => {
    res.sendFile("/Users/Kalkeshc/Desktop/Node js pstmt/Problem-2" + "/index.html");
  });
  
  server.listen(8080, () => {
    console.log("listening on *:8080");
  });