const { Router } = require('express');
const { getUsuarios, postUsuarios, putUsuarios, patchUsuarios, deleteUsuarios } = require('../controllers/usuarios');

const router = Router();

router.get('/:id', getUsuarios);

router.post('/', postUsuarios);

router.put('/', putUsuarios);

router.patch('/', patchUsuarios);

router.delete('/:id', deleteUsuarios);

module.exports = router;