const {request, response} = require('express');

const {Producto} = require('../models/index');

const obtenerProductoPorId = async (req, res = response) => {

    const id = req.params.id;

    try{

        const producto = await Producto.findById(id)
                                        .populate('categoria', ['nombre'])
                                        .populate('usuario', ['nombre']);
                                        //.exec(); //Usar el exec al usar el populate, no del todo cierto

        res.json({
            producto
        });
    }catch (err){
        
        res.status(400).json({
            msg: 'Error obteniendo los datos',
            err
        });
    }

};

const obtenerProductos = async (req, res = response) => {

    const {limite = 5, desde = 0 } = req.query;
    const query = {estado : true}

    try{

        const [productos, total ] = await Promise.all([

            //Producto.find(query).populate('usuario', 'nombre').skip(Number(desde)).limit(Number(limite)),
            Producto.find(query)
                    .populate('categoria', ['nombre'])
                    .populate('usuario', ['nombre'])
                    .skip(Number(desde))
                    .limit(Number(limite)),

            Producto.count()

        ]);

        res.json({
            total,
            productos,
        });
    }catch (err){
        
        res.status(400).json({
            msg: 'Error obteniendo los datos',
            err
        });
    }
};

const crearProducto = async (req, res = response) => {

    const {nombre, precio, categoria, descripcion} = req.body;

    console.log(nombre, precio, categoria, descripcion, req.usuario);

    try{

        const productoDB = await Producto.findOne({nombre});

        if(productoDB){

            res.status(400).json({
                msg: `El producto ${productoDB.nombre} ya existe`
            });
        }

        //Generar la data
        const data = {
            nombre: nombre.toUpperCase(),
            precio,
            categoria,
            descripcion,
            usuario: req.usuario._id
        }

        const producto = new Producto(data);

        await producto.save();

        res.status(201).json({
            producto
        });
    }catch (err){
            
        res.status(400).json({
            msg: 'Error creando los datos',
            err
        });
    }
};

const modificarProducto = async (req, res = response) => {

    const id = req.params.id;

    try{

        const {_id, estado, usuario, __v, categoria, ...resto} = req.body;

        resto.nombre = resto.nombre.toUpperCase();

        //Con el new:true enviamos el nuevo archivo
        const producto = await Producto.findByIdAndUpdate(id, resto, {new : true});

        res.status(200).json({
            producto
        });

    }catch (err){
            
        res.status(400).json({
            msg: 'Error modificando los datos',
            err
        });
    }
}

const eliminarProducto = async  (req, res = response) => {

    const id = req.params.id;

    try{

        const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new : true});

        res.json({
            producto
        });

    }catch (err){
        
        res.status(400).json({
            msg: `La producto no se pudo eliminar`,
            err
        });
    }
} 


module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto
}