const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario', //Esto debe ser igual a como se declara el object Id del objeto
        required: true
    },
});

CategoriaSchema.methods.toJSON = function(){

    const {__v, estado,  ...categoria} = this.toObject();

    return categoria;

}


module.exports = model('categoria', CategoriaSchema);