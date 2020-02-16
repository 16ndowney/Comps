// const EventEmitter = require('events');
// const emitter = new EventEmitter();



// const Logger = require('./logger');
// const logger = new Logger();


// logger.on('messageLogged', function(arg){
//     console.log(arg);
// });

//logger.log("test");

const http = require('http');

const server = http.createServer(function(req, res){
    if(req.url ==='/'){
        res.write('Hello World');
        res.end();
    }
    
});

const port = 3000;
server.listen(port);

console.log(`Listening on port ${port}`);

server.on('connection', function(socket){
    console.log('new user connected');
});