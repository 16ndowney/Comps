const http = require('http');
const fs = require('fs');
const port = 3000;

const server = http.createServer(function(req, res){
    console.log(req.url);
           
    switch(req.url){

        case '/css/main.css':
            fs.readFile('css/main.css', function(error, data){
                if(error){
                    res.writeHead(404);
                    res.write('Error, File Not Found');
                }else{
                    res.writeHead(200, {'Content-Type': 'text/css'});
                    res.write(data);
                }
                res.end();
            });
        break;

        case '/js/client.js':
            fs.readFile('js/client.js', function(error, data){
                if(error){
                    res.writeHead(404);
                    res.write('Error, File Not Found');
                }else{
                    res.writeHead(200, {'Content-Type': 'text/javascript'});
                    res.write(data);
                }
                res.end();
            });
        break;
        
        default:
            fs.readFile('index.html', function(error, data){
                if(error){
                    res.writeHead(404);
                    res.write('Error, File Not Found');
                }else{
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                }
                res.end();
            });
        break;
    }
});

server.listen(port, function (error){
    if (error){
        console.log('Something went wrong', error);
    }else{
        console.log(`Listening on port ${port}`);
    }
});


server.on('connection', function(socket){
    console.log('new user connected');
});