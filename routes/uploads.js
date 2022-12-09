const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { cargarArchivos, actualizarImg, mostrarImagen, actualizarImgCloudinary } = require('../controllers/uploads');
const { validarColeccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivoSubir } = require('../middlewares');



const router = Router();

router.post('/', [
    validarArchivoSubir,
    validarCampos
], cargarArchivos);

router.put('/:coleccion/:id', [

    check('id', 'El Id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => validarColeccionesPermitidas( c , ['usuarios', 'productos'])),
    validarArchivoSubir,
    validarCampos
], actualizarImgCloudinary);
//], actualizarImg);

router.get('/:coleccion/:id',[
    check('id', 'El Id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => validarColeccionesPermitidas( c , ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);


module.exports = router;