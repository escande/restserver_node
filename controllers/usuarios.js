const { respose, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = respose) => {
    //const {id} = req.params;
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    //Casteamos el limite a numero porque el argumento limite puede ser un texto
    //const usuarios = await Usuario.find(query).skip(Number(desde)).limit(Number(limite));

    //const total = await Usuario.countDocuments(query);

    //Con el promise.all ejecutamos las promesas de forma simultanea y no esperamos a que termine cada una
    //Ganamos tiempo
    //Podemos recoger el arreglo de las 2 promesas o desestructurar
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
    ]);

    res.json({
       total,
       usuarios
    });
}

const postUsuarios = async (req = request, res = respose) => {

    try{

        const {nombre, password, email, role} = req.body;

        //Para usar los datos desestructurados, se debe de pasar un objeto por eso entre {}
        const usuario = new Usuario({nombre, password, email, role});
        //console.log(usuario);
        
        //Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = bcrypt.hashSync(password, salt);


        //Guardar en la DB
        await usuario.save();

        res.status(201).json({
            ok: true,
            msg: 'Post desde el Controller',
            usuario
        });
    }catch(err){

        res.status(400).json({
            ok: false,
            err
        });
    }
}

const putUsuarios = async (req = request, res = respose) => {

    try{

        const { id } = req.params;
        const {_id, password, google, email, ...resto } = req.body;

        //TODO: Validar contra base de datos
        if( password ){
            //Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            resto.password = bcrypt.hashSync(password, salt);
        }

        const usuario = await Usuario.findByIdAndUpdate(id, resto);

        res.status(201).json({
            usuario,
        });
    }catch (err){
        res.status(400).json({
            ok: false,
            err
        }); 
    }
}

const patchUsuarios =  (req = request, res = respose) => {

    res.json({
        ok: true,
        msg: 'Delete desde el Controller'
    });
}

const deleteUsuarios = async (req = request, res = respose) => {

    const {id} = req.params;
    const estado = {estado: false};

    //Fisicamente lo borramos -  no recomendable
    //const usuario = await Usuario.findByIdAndRemove(id);

    const usuario = await Usuario.findByIdAndUpdate(id, estado);

    res.json({
        usuario
    });
}

module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    patchUsuarios,
    deleteUsuarios
}