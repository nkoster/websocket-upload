const
    app = require('express')(),
    http = require('http').createServer(app),
    io = require('socket.io')(http)

app.set('view engine', 'ejs');

// app.use(.static('public'));

app.get('/', (req, res) => {
    res.render('index')
})

io.on('connection', function(socket) {
    console.log('a user connected')
})
  
http.listen(9999, function(){
    console.log('listening on *:9999')
})
