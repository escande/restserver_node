const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const { postLogin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
],postLogin);


module.exports = router;