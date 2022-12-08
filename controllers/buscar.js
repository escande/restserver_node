const {response} = require('express');
const {Types} = require('mongoose');
const {Usuario, Categoria, Producto, Role} = require('../models/index');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];


const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoId = Types.ObjectId.isValid(termino);

    if(esMongoId){

        const usuario = await Usuario.findById(termino);

        res.json({
            results: usuario ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {email: regex}], //El $or es especifico de Mongo
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios ? usuarios : []
    });

}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoId = Types.ObjectId.isValid(termino);

    if(esMongoId){

        const categoria = await Categoria.findById(termino);

        res.json({
            results: categoria ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    
    const categorias = await Categoria.find({
        $or: [{nombre: regex}], //El $or es especifico de Mongo
    });

    res.json({
        results: categorias ? categorias : []
    });

}

const buscarProductos = async (termino = '', res = response) => {

    const esMongoId = Types.ObjectId.isValid(termino);

    if(esMongoId){

        const producto = await Producto.findById(termino)
                .populate('categoria',['nombre']);

        res.json({
            results: producto ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    
    const productos = await Producto.find({
        $or: [{nombre: regex},], //El $or es especifico de Mongo
        $and: [{disponible: true, estado: true}]
    })
    .populate('categoria',['nombre']);

    res.json({
        results: productos ? productos : []
    });

}

const buscarRoles = async (termino = '', res = response) => {

    const regex = new RegExp(termino, 'i');
    
    const roles = await Role.find({
        $or: [{role: regex},], //El $or es especifico de Mongo
    });

    res.json({
        results: roles ? roles : []
    });

}

const buscar = async (req, res = response) => {

    const {coleccion, termino} = req.params;

    try{

        if (!coleccionesPermitidas.includes(coleccion)){

            res.status(400).json({
                msg: `La busqueda ${coleccion} no está permitida`
            });
        }

        switch(coleccion){
            case 'usuarios':
                await buscarUsuarios(termino, res);
                break;
            case 'categorias':
                await buscarCategorias(termino, res);
                break;

            case 'productos':
                await buscarProductos(termino, res);
                break;

            case 'roles':
                await buscarRoles(termino, res);
                break;

            default:
                res.status(500).json({
                    msg: 'Se le olvido hacer esta busqueda'
                });
        }
    }catch (err){
        
        res.status(500).json({
            msg: 'Se produjo un error en la busqueda'
        });
    }
}


module.exports = {
    buscar,
}