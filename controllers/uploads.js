const { response } = require("express");
const cloudinary = require('cloudinary').v2
const path = require('path');
const fs = require('fs');

const { subirArchivo } = require("../helpers/index");
const {Usuario, Producto} = require('../models/index');

//Para authenticarnos en cloudinari mediante el APIKey
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivos = async (req, res = response) => {

    try{

        //const nombre = await  subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await  subirArchivo(req.files, undefined, 'imgs');

        res.json({
            nombre
        });
    }catch (err){

        res.status(400).json({
            msg: err
        });
    }
}

const actualizarImg = async (req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if(!modelo){

                return res.status(400).json({msg: `No existe un usuario con ID: ${id}`});
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);

            if(!modelo){

                return res.status(400).json({msg: `No existe un Producto con ID: ${id}`});
            }
            break;

        default:
            return res.status(500).json({msg: 'Se olvido evaluar esto...'});
    }

    //Limpiar imagenes previas
    if(modelo.img){

        //hay imagenes
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if(fs.existsSync(pathImg)){

            fs.unlinkSync(pathImg);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    
    await modelo.save();

    res.json({
        modelo
    });

}

const actualizarImgCloudinary = async (req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if(!modelo){

                return res.status(400).json({msg: `No existe un usuario con ID: ${id}`});
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);

            if(!modelo){

                return res.status(400).json({msg: `No existe un Producto con ID: ${id}`});
            }
            break;

        default:
            return res.status(500).json({msg: 'Se olvido evaluar esto...'});
    }

    //Limpiar imagenes previas
    if(modelo.img){
        //Limpiar imagenes de cloudinary
        const nombreArr = modelo.img.split('/');

        const nombre = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');


        //Eliminamos el fichero pasando el nombre que obtenemos del final de la url
        //No hacemos el await porque nos da igual la espera...
        cloudinary.uploader.destroy(public_id);
        
    }

    //console.log(req.files.archivo);
    //Extraigo el path temporal donde nos lo deja el fileUpdater dentro de archivo
    const { tempFilePath } = req.files.archivo;

    //Solo me interesa el secure_url, por eso desenstructuro el objeto
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    
    await modelo.save();

    res.json({
        modelo
    });

}

const mostrarImagen =  async (req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if(!modelo){

                return res.status(400).json({msg: `No existe un usuario con ID: ${id}`});
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);

            if(!modelo){

                return res.status(400).json({msg: `No existe un Producto con ID: ${id}`});
            }
            break;

        default:
            return res.status(500).json({msg: 'Se olvido evaluar esto...'});
    }

    // //Para imagenes local
    // if(modelo.img){

    //     //hay imagenes
    //     const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);

    //     //console.log(pathImg);

    //     if(fs.existsSync(pathImg)){

    //         return res.sendFile(pathImg);
    //     }
    // }

     //Para cloudynary, enviamos el link
    if(modelo.img){

        //TODO: Esto hay que mejorarlo , descargando la imagen en vez de psar el link
        const nombreArr = modelo.img.split('/');

        const nombre = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');

        const image = cloudinary.image(public_id, { transformation: { width: 400, crop: "pad" }})

        //console.log(image);
        return res.send(image);
    }

    const pathNoImg = path.join(__dirname, '../assets', 'no-image.jpg');

    console.log('No Image:', pathNoImg);

    res.sendFile(pathNoImg);

}


module.exports = {
    cargarArchivos,
    actualizarImg,
    mostrarImagen,
    actualizarImgCloudinary
}