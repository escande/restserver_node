const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { getUsuarios, postUsuarios, putUsuarios, patchUsuarios, deleteUsuarios } = require('../controllers/usuarios');
const { esRoleValido, existeEmail, existeUsuarioId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const Role = require('../models/role');

const router = Router();

router.get('/', getUsuarios);

//El segundo argumento es un middleware que usamos para validar
//Si mandamos 3 argumentos, en caso de 2 es el callback
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y debe de tener 6 caracteres').isLength(6),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom(existeEmail),
    //check('role', 'El role no es válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(esRoleValido),
    validarCampos //Se pone el ultimo la verificación de los anteriores middlewares
], postUsuarios); 

router.put('/:id', [
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    check('role').custom(esRoleValido),
    validarCampos
],putUsuarios);

router.patch('/', patchUsuarios);

router.delete('/:id',[
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], deleteUsuarios);

module.exports = router;