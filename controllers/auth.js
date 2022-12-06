const { respose, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const postLogin = async (req, res = respose) => {

    try{

        const {email, password} = req.body;
        
        //Verficar si el email existe
        const usuario = await Usuario.findOne({email});

        if (!usuario){

            res.status(400).json({
                msg: 'El usuario o el password no son correctos'
            });
        }

        //SI el usuario esta activo
        if (!usuario.estado){

            res.status(400).json({
                msg: 'Usuario o password no son correctos porque el estado es false'
            });
        }

        //Verificar la costraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){

            res.status(400).json({

                msg: 'Usuario o password no son correctos'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id, generarJWT);

         res.json({
            usuario,
            token   
        });
    }catch (err){

        console.log(err);
         res.status(500).json({
            msg: err
        });
    }
}


module.exports = {
    postLogin,
}