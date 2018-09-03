var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var app = express();

var http = require('http').Server(app)
var io = require('socket.io')(http)

dbURL = "mongodb://nedu10:chukwuemeka11@ds141952.mlab.com:41952/learning-node"

var Message = mongoose.model('Message', {
    name: String,
    body: String
})

// var messages = [
//     {
//         name: "chinedu",
//         body: 'i am a student of the university of benin'
//     },
//     {
//         name: "moses",
//         body: 'part of the bible story'
//     },
//     {
//         name: "ronaldo",
//         body: 'juve player'
//     }
// ]
app.use(express.static('file'));

app.use(bodyParser.json()) //handles data from api
app.use(bodyParser.urlencoded({ extended: false }));//handles data from form url

app.use(cors()); //middleware that helps us request ajax api from different domain

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})
app.post('/messages', (req, res) => {
    console.log(req.body)
    var message = new Message(req.body);
    
    message.save((err) => {
        if(err){
            res.sendStatus(500)
        }
        //messages.push(req.body)
        io.emit('message', req.body)
        res.sendStatus(200)
    })
    
    
})

io.on('connection', (socket) => {
    console.log('a user is connected')
})

mongoose.connect(dbURL, {useNewUrlParser: true}, (err) => {
    console.log('you are connected to mongodb ', err)
})

var server = http.listen(3000, () => {//since we are using socketio http should be listenning now.
    console.log('server is listenning on port ',server.address().port)
})

//console.log('starting server', server.address().port)