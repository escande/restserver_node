const { response } = require("express")


const esAdminRole = (req, res = response, next) => {

    if(!req.usuario){

        res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token'
        });
    }

    const {role, nombre } = req.usuario;

    if(role !== 'ADMIN_ROLE'){

        return res.status(401).json({
            msg: 'El usuario no tiene un ADMIN-ROLE'
        });
    }

    next();

}

//Uso del operador rest ...roles
const tieneRole = (...roles) => {

    return (req, res = response, next) => {

        if(!req.usuario){

            res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token'
            });
        }

        if(!roles.includes(req.usuario.role)){

            res.status(401).json({
                msg: 'El usuario no tiene un ROLE autorizado'
            });
        }

        next();

    }

}


module.exports = {
    esAdminRole,
    tieneRole
}