const
    app = require('express')(),
    http = require('http').createServer(app),
    io = require('socket.io')(http)

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

io.on('connection', (socket) => {
    console.log('a user connected')
    console.log(socket.rooms)
})
  
http.listen(9999, () => {
    console.log('listening on *:9999')
})
