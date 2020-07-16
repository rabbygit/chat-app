const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const {
    userJoin
} = require("./utils/users")


app.get('/', (req, res) => {
    res.send("Hello")
});

io.on('connection', (socket) => {

    socket.on('SEND_USER', (user) => {
        const newUser = userJoin(socket.id, user)

        // socket.join(newUser.name)
        console.log(newUser)

        socket.emit('WELCOME', `welcome ${user} to chat`);
        socket.broadcast.emit("NEW_USER_JOIN", `${user} joins in chat`)
    })


    console.log("A user connected")

    socket.on('SEND_MESSAGE', (message) => {

        io.emit('MESSAGE', message);

    })

    socket.on('disconnect', () => {
        socket.broadcast.emit("USER_LEFT", "A user left")
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
}); 