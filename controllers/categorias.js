const {response} = require('express');
const {Categoria} = require('../models/index');

const obtenerCategoriaPorId = async (req, res = response) => {

    const id = req.params.id;

    try{

        const categoria = await Categoria.findById(id)
                                        .populate('usuario', ['nombre']);

        res.json({
            categoria
        });
    }catch (err){
        
        res.status(400).json({
            msg: 'Error obteniendo los datos',
            err
        });
    }

};

const obtenerCategorias = async (req, res = response) => {

    const {limite = 5, desde = 0 } = req.query;
    const query = {estado : true}

    try{

        const [categorias, total ] = await Promise.all([

            //Categoria.find(query).populate('usuario', 'nombre').skip(Number(desde)).limit(Number(limite)),
            Categoria.find(query)
                    .populate('usuario', ['nombre'])
                    .skip(Number(desde))
                    .limit(Number(limite)),
                    
            Categoria.count()

        ]);

        res.json({
            total,
            categorias,
        });
    }catch (err){
        
        res.status(400).json({
            msg: 'Error obteniendo los datos',
            err
        });
    }
};

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    try{

        const categoriaDB = await Categoria.findOne({nombre});

        if(categoriaDB){

            res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre} ya existe`
            });
        }

        //Generar la data
        const data = {
            nombre,
            usuario: req.usuario._id
        }

        const categoria = new Categoria(data);

        await categoria.save();

        res.status(201).json({
            categoria
        });
    }catch (err){
            
        res.status(400).json({
            msg: 'Error creando los datos',
            err
        });
    }
};

const modificarCategoria = async (req, res = response) => {

    const id = req.params.id;

    try{

        const {_id, estado, usuario, __v, ...resto} = req.body;

        resto.nombre = resto.nombre.toUpperCase();

        //Con el new:true enviamos el nuevo archivo
        const categoria = await Categoria.findByIdAndUpdate(id, resto, {new : true});

        res.status(200).json({
        categoria
        });

    }catch (err){
            
        res.status(400).json({
            msg: 'Error modificando los datos',
            err
        });
    }
}

const eliminarCategoria = async  (req, res = response) => {

    const id = req.params.id;

    try{

        const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new : true});

        res.json({
            categoria
        });

    }catch (err){
        
        res.status(400).json({
            msg: `La categoria no se pudo eliminar`,
            err
        });
    }
}


module.exports = {
    obtenerCategoriaPorId,
    obtenerCategorias,
    crearCategoria,
    modificarCategoria,
    eliminarCategoria
}