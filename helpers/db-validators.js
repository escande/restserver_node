const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria')


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

    console.log(id);
    const existeCategoria = await Categoria.findById(id);
    //console.log(existeCategoria);

    if(!existeCategoria){

        throw `La categoria con ID: ${id} no está registrado en la DB`;
    }
}

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioId,
    existeCategoria
}