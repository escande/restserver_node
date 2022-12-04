const { respose, request } = require('express')

const getUsuarios = (req = request, res = respose) => {

    const {id} = req.params;

    res.json({
        ok: true,
        msg: 'Get desde el Controller',
        id,
    });
}

const postUsuarios = (req = request, res = respose) => {

    const body = req.body;

    console.log(body);

    res.status(201).json({
        ok: true,
        msg: 'Post desde el Controller',
        body
    });
}

const putUsuarios =  (req = request, res = respose) => {

    const {nombre, apellidos, id} = req.body;

    res.status(201).json({
        ok: true,
        msg: 'Put desde el Controller',
        nombre,
        apellidos,
        id
    });
}

const patchUsuarios =  (req = request, res = respose) => {

    res.json({
        ok: true,
        msg: 'Delete desde el Controller'
    });
}

const deleteUsuarios = (req = request, res = respose) => {

    const {id} = req.params;
    const {fecha} = req.query;

    res.json({
        ok: true,
        msg: 'Delete desde el Controller',
        id,
        fecha
    });
}

module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    patchUsuarios,
    deleteUsuarios
}