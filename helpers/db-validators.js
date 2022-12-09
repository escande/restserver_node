// const Role = require('../models/role');
// const Usuario = require('../models/usuario');
// const Categoria = require('../models/categoria')
//const mongoose = require('mongoose');

const {Role, Usuario, Categoria, Producto} = require('../models/index');


const esRoleValido = async (role = '') => {

    console.log(role);
    const existeRol = await Role.findOne({role});
    console.log(existeRol);

    if(!existeRol){

        throw 'El rol no está registrado en la DB';
    }

}

const existeEmail = async (email) => {

    //Verificar si el correo ya existe
    console.log(email);
    const existeEmail = await Usuario.findOne({email});
    //console.log(existeEmail);
    if(existeEmail){

        throw `El correo ${email} ya está registrado`;
    }

}

const existeUsuarioId = async (id) => {

    //Verificar si el id ya existe
    //console.log(id);
    const existeId = await Usuario.findById(id);
    //console.log(existeId);
    if(!existeId){

        throw `El Id ${id} no existe`;
    }

}

const existeCategoria = async (id = '') => {

    //console.log(id);
    try{
        const existeCategoria = await Categoria.findById(id);
        //console.log(existeCategoria);

        if(!existeCategoria){

            throw `La categoria con ID: ${id} no está registrado en la DB`;
        }

    }catch (err){
        throw `La categoria con ID: ${id} no está registrado en la DB`;
    }
}

const existeProducto = async (id = '') => {

    try{
        console.log(id);
        //mongoose.Types.ObjectId("51bb793aca2ab77a3200000d")
        const existeProducto = await Producto.findById(id);
        //console.log(existeProducto);

        if(!existeProducto){

            throw `El producto con ID: ${id} no está registrado en la DB`;
        }
    }catch (err){
        throw  `El producto con ID: ${id} no está registrado en la DB`;
    }
}

const validarColeccionesPermitidas = (coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes(coleccion);

    if(!incluida){

        throw `La colección "${coleccion}" no es permitida, [${colecciones}]`;
    }

    //Se deberia de devolver en todas el true pero lo hacemos de forma implicita porque son Promesas
    // y siempre al no devolver error se entiende que es ok la promesa
    return true; 

}

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioId,
    existeCategoria,
    existeProducto,
    validarColeccionesPermitidas
}