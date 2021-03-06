const
    app = require('express')(),
    http = require('http').createServer(app),
    fs = require('fs'),
    io = require('socket.io')(http)

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

io.on('connection', socket => {
    console.log(socket.handshake.address)
    socket.on('upload', data => {
        if (typeof data.filename === 'string') {
            socket.upload = '/tmp/' + data.filename
            console.log('Receiving ' + socket.upload)
            socket.fd = fs.openSync(socket.upload, 'w')    
        } else {
            socket.upload = () => {}
        }
    })
    socket.on('chunk', chunk => {
        if (socket.upload) {
            fs.appendFile(socket.upload, chunk, err => {
                if (err) {
                    console.error(err)
                } else {
                    socket.emit('appended')
                }
            })
        }
    })
    socket.on('ready', () => {
        console.log('ready')
    })
})
  
http.listen(9999, () => {
    console.log('flextube listening on :9999')
})
