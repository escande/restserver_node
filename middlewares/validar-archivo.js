const { response } = require("express");


const validarArchivoSubir = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({
            msg: 'No hay archivo en la petición'
        });
    }

    if (!req.files.archivo ) {
        res.status(400).json({
            msg: 'No hay archivo en la petición'
        });
    }

    next();
}

module.exports = {
    validarArchivoSubir,
}