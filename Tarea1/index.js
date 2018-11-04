//Definimos las dependencias
var http = require('http');
var url = require('url');
var config = require('./config');
var StringDecoder= require('string_decoder').StringDecoder;


//Se instancia el servidor HTTP

var httpServer = http.createServer( function(req, res){
unifiedServer(req, res);
});

//Se inicia el servidor escuchando en el puerto 3001
    httpServer.listen(config.httpPort, function(){
        console.log("El servidor está escuchando en el puerto "+config.httpPort+" en el ambiente "+config.envName);
    });

    var unifiedServer = function(req, res){

    //Obtenemos y parseamos la url ingresada
    var parsedURL = url.parse(req.url, true);
    
    //Obtenemos la ruta:
    var path = parsedURL.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //Obtenemos el querystring
    var queryStringObject = parsedURL.query;

    //Obtenemos el método de envío
    var method = req.method.toLowerCase();

    //Obtener el payload si existe:
    var decoder = new StringDecoder('utf-8');
    var buffer ='';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end', function(){
        buffer += decoder.end();
    });
 
   
    //Se determina cuál es el manejador seleccionado 
    var chosenHandler = typeof(router[trimmedPath])!= 'undefined'?router[trimmedPath]:handlers.notFound;

    //Construct the data object to send to the handler
    
    var data = {
        'trimmedPath': trimmedPath
        ,'queryStringObject': queryStringObject
        ,'method': method
        ,'payload': buffer

    }

        //Enrutar la petición al manejador 
        chosenHandler(data, function(statusCode, payload){
        statusCode = typeof(statusCode) == 'number'? statusCode : 200;
         //Use the payload called back by the handler, or default to an empty object
         payload = typeof(payload)=='object'? payload:{};

         //Convert the payload to a string 
         var payloadString = JSON.stringify(payload);
 
         //Return the response
         res.setHeader('Content-Type','application/json');
         res.writeHead(statusCode);
 
         //Send the response        
         res.end(payloadString);
 
         //Log the request path 
         console.log('Devolviendo esta respuesta: ',statusCode, payloadString);
     });
 
    };

    //Se define el manejador
    var handlers = {};
    handlers.hello= function(data, callback){
     //Callback del estado http y el objeto payload
     callback(200, {'hello':'Hello, bienvenido a este espectacular curso de NODEjs dónde vas a aprender NODEjs a profundidad. ',data});
    };
    
    handlers.notFound = function(data, callback){
        callback(404)
    };


    var router = {
        'hello': handlers.hello
    };