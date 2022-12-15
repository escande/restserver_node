const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const { postLogin, googleSignIn, renovarToken } = require('../controllers/auth');
const { validarCampos, validarJWT } = require('../middlewares/index');

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
],postLogin);

router.post('/google', [
    check('id_token', 'El Id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);

router.get('/', [
    validarJWT,
    validarCampos
],renovarToken);


module.exports = router;