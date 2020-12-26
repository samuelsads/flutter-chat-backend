const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index')
const {usuarioConectado, usuarioDesconectado, grabarMensaje}  = require('../controllers/socket');
io.on('connection', async (client) => {
    
    const[valido,uid] = comprobarJWT(client.handshake.headers['x-token'])

    //verificar autenticación
    if(!valido){return client.disconnect();}

    //Cliente autenticado
    usuarioConectado(uid);
    //ingresar al usuario a una sala
    client.join(uid);

    //Escuchar mensaje
    client.on('mensaje-personal',async(payload)=>{
        console.log(payload);
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal',payload);
    })

    client.on('disconnect', () => {
        usuarioDesconectado(uid)
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje!!!', payload);
        io.emit('mensaje', { admin: 'nuevo mensaje' });
    });
});