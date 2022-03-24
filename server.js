const
    app = require('express')(),
    http = require('http').createServer(app),
    fs = require('fs'),
    io = require('socket.io')(http)
const {exec} = require('child_process')

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
        console.log('ready', socket.upload)
        analyze(socket)
    })
})
  
http.listen(9999, () => {
    console.log('flextube listening on :9999')
})

function analyze(socket) {
    const ffmpeg = `2>&1 \\
      timeout --foreground 5 ffmpeg -i "${socket.upload}" \\
      -af loudnorm=I=-16:dual_mono=true:TP=-1.5:LRA=11:print_format=summary \\
      -f null - | \\
      egrep '^Input|^Output|^Normalization|^Target'`
    exec(ffmpeg, (err, stdout, stderr) => {
        if (err) {
            console.log(err.message)
            return
        }
        const rawOutput = stdout.split('\n')
        const inputIntegrate = rawOutput[2].split(':')[1].trim()
        const inputTruePeak = rawOutput[3].split(':')[1].trim()
        const inputLRA = rawOutput[4].split(':')[1].trim()
        const inputThreshold = rawOutput[5].split(':')[1].trim()
        const outputIntegrated = rawOutput[6].split(':')[1].trim()
        const outputTruePeak = rawOutput[7].split(':')[1].trim()
        const outputLRA = rawOutput[8].split(':')[1].trim()
        const outputThreshold = rawOutput[9].split(':')[1].trim()
        const normalizationType = rawOutput[10].split(':')[1].trim()
        const targetOffset = rawOutput[11].split(':')[1].trim()
        const result = {
            inputIntegrate, inputTruePeak, inputLRA, inputThreshold,
            outputIntegrated, outputTruePeak, outputLRA, outputThreshold,
            normalizationType, targetOffset
        }
        console.log(result)
        socket.emit('result', result)
    })
}
