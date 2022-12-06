// {
//     nombre: 'asd',
//     email: 'jiji@jijij.com',
//     password: 'dededeedde',
//     img: 'dededeededed',
//     rol: 'dedededed',
//     estado: true,
//     google: true
// }

const {Schema, model} = require('mongoose');


const usuarioSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
    },
    email: {
        type: String,
        require: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        require: true,
        //enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    Google: {
        type: Boolean,
        default: false
    },
})

//Debe de ser una funcion normal, sino , no funcionará
//Sobre-escribimos el metodo toJOSN
//con esto quitamos lo que no queremos que aparezca y el resto es el usuarios sin los campos
usuarioSchema.methods.toJSON = function(){

    const {__v, password, ...usuario } = this.toObject();

    return usuario;

}

module.exports = model('Usuarios', usuarioSchema);