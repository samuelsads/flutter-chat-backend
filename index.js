const express = require('express');
const path = require('path');
require('dotenv').config();

//APP express
const app = express();

//Node server
const server = require('http').createServer(app);

// db config 
const { dbConnection } = require('./database/config');

dbConnection();


//lectura y parseo del body
app.use( express.json());

module.exports.io = require('socket.io')(server);

require('./sockets/socket');

//PATH PUBLIC   
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

//rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/mensajes',require('./routes/mensajes'));

server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);
    console.log('servidor corriendo en puerto');
});