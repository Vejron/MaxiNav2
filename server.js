var WebSocketServer = require('websocket').server;
//var http = require('http');
var restify = require('restify');
var fs = require('fs');
var db = require('./server.db.js');

var server = restify.createServer({
   name: 'felling',
   version: '1.0.0'
});

// restify config
server.use(restify.queryParser())
server.use(restify.CORS())
server.use(restify.fullResponse())

// Routes
server.get('/felling/area_defs', db.getAreaDefs);
server.get('/felling/within', db.selectBox);
server.get('/felling/tracking', db.getLocationHistory);
server.get('/felling/production', db.getLocationProduction);
server.get('/status', function(req, res, next) {
   res.send("{status: 'ok'}");
});

server.listen(8080, function() {
   console.log('%s listening at %s', server.name, server.url);
});


// create the websocket service
var wsServer = new WebSocketServer({
   httpServer: server
});

var currentObject = {
   state: '',
   areaUid: -1,
   index: 0,
   tracks: null,
   load: function(areaUid, tracks) {
      this.areaUid = areaUid;
      this.tracks = tracks
      this.index = 0;
   },
   next: function() {
      this.index++;
      // stop at end
      if(this.index > this.tracks.length) {
         this.index = this.tracks.length;
      }
      return {
         state: this.state,
         areaUid: this.areaUid,
         index: this.index,
         tracks: this.tracks.slice(0, this.index)
      };
   }
}

var intervalId = 0;


function startStream(areaUid, interval, connection) {
   currentObject.state = 'loading'
   console.log(`!! start`);
   db.getTracks(areaUid, (rows) => {
      // setup
      currentObject.state = 'ready'
      currentObject.load(areaUid, rows);
      // start streaming
      intervalId = setInterval(() => {
         connection.sendUTF(JSON.stringify(currentObject.next()));
         console.log(`frame nbr: ${currentObject.index} for area-uid: ${areaUid}`);
      }, interval);
      
   });
}

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
   console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

   // accept connection - you should check 'request.origin' to make sure that
   // client is connecting from your website
   // (http://en.wikipedia.org/wiki/Same_origin_policy)
   var connection = request.accept(null, request.origin);

   // This is the most important callback for us, we'll handle
   // all messages from users here.
   connection.on('message', function(message) {
      if (message.type === 'utf8') {
         // process WebSocket message
         
         let inner = JSON.parse(message.utf8Data);
         console.log(message.utf8Data);

         if (inner.command === 'begin') {
            startStream(inner.areaUid, inner.interval, connection);
         } else if (inner.command == 'rewind') {
            startStream();
         } else {

         }
      }
   });

   connection.on('close', function(connection) {
      // close user connection
      clearInterval(intervalId);
      console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
   });
});