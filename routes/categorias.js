const {Router} = require('express');
const { check } = require('express-validator');

const { crearCategoria, obtenerCategorias, obtenerCategoriaPorId, modificarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');
const { validarJWT, validarCampos } = require('../middlewares');

const router = Router();

//Obtener todas las categorias
//Middleware check categoria
router.get('/', obtenerCategorias);

//Obtener una categoria por ID
router.get('/:id',[
    validarJWT,
    check('id', 'No es un Id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoriaPorId);

//Crear categoria con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

//Actualizar, privado con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un Id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
],modificarCategoria);

//poner estado en false
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un Id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
] ,eliminarCategoria);


module.exports = router;