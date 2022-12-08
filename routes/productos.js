const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT} = require('../middlewares/index');

const {
        obtenerProductos, 
        obtenerProductoPorId, 
        crearProducto, 
        modificarProducto, 
        eliminarProducto
    } = require('../controllers/productos');

const { existeProducto, existeCategoria } = require('../helpers/db-validators');

router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
    validarJWT,
    check('id', 'El id de producto no cumple la regla de DB').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
],obtenerProductoPorId);

router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'El id categoria no cumple la regla de DB').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto);

router.put('/:id',[
    validarJWT,
    check('id', 'El id de producto no cumple la regla de DB').isMongoId(),
    check('id').custom(existeProducto),
    // check('categoria', 'El id categoria no cumple la regla de DB').isMongoId(),
    // check('categoria').custom(existeCategoria), //Para no obligar al cliente a enviar la categoria
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], modificarProducto);

router.delete('/:id',[

    validarJWT,
    check('id', 'El id de producto no cumple la regla de DB').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos

], eliminarProducto);


module.exports = router;
