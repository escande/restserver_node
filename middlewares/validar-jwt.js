const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req, res = response, next) => {

    const token = req.header('x-token');

    if(!token){

        res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try{

        const {uid} = jwt.verify(token, process.env.SECRETOPRIVATEKEY);
        
        //Se crea una nueva referencia en el request que es uid
        req.uid = uid;

        const usuario = await Usuario.findById(uid);

        if(!usuario){

            res.status(401).json({
                msg: 'Usuario no existe en DB'
            });
        }

        //Verificar si el usuario tiene estado en true
        if(!usuario.estado){

            res.status(401).json({
                msg: 'Token no valido, usuario desactivado'
            });
        }

        req.usuario = usuario;
    
        next()

    }catch (err){

        res.status(401).json({
            msg: 'Token no valido'
        });
    }
}


module.exports = {
    validarJWT,
}