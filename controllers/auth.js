const { response } = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const login = async (req,res  = response)=>{

    const { email, password} = req.body;

    try {
        const usuarioDB  = await  Usuario.findOne({email});
        if(!usuarioDB){
            return res.status(404).json({
               ok:false,
               msg:'Email no encontrado'
            });
        }

        const validPass = bcrypt.compareSync(password,usuarioDB.password);
        if(!validPass){
            return res.status(404).json({
                ok:false,
                msg:'La contraseña no es validad'
             });
        }

        const token  = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario:usuarioDB,
            token
        });
    } catch (error) {
       
        return res.status(500).json({
            ok:false,
            msg:"Hable con el administrador"
        });
    }
    
};
const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const existEmail = await Usuario.findOne({ email });
        if (existEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
        const usuario = new Usuario(req.body);
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        await usuario.save();
        const token  = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const renewToken  = async (req, res  = response )=>{

    const uid  = req.uid;

    const token = await generarJWT( uid );
    const usuarioDB  = await Usuario.findById(uid);

    res.json({
        ok:true,
        uid:req.uid,
        usuario:usuarioDB,
        token
    });
}


module.exports = {
    crearUsuario,
    login,
    renewToken
}