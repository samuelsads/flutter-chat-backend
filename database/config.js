const mongoose = require('mongoose');

const dbConnection = async () => {
    console.log("samuel");
    try {
        await mongoose.connect(process.env.DB_CNN, { 
            useNewUrlParser: true, useUnifiedTopology: true
        });
        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error en la base de datos - Conectate con el administrador')
    }
}

module.exports = {
    dbConnection
}