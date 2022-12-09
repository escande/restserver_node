const { v4: uuidv4 } = require('uuid');
const path = require('path'); //Importante para saber el path, es propio de node

const subirArchivo = ( files, extensionesValidas = ['jpg', 'jpeg', 'png', 'gif'], carpeta = '' ) => {

    return new Promise((resolve, reject) => {

        const {archivo} = files;

        const nombreCortado = archivo.name.split('.');

        const extensiones = nombreCortado[nombreCortado.length -1];

        if(!extensionesValidas.includes(extensiones)){

            return reject(`La extensión ${extensiones} no es permitida, solo [${extensionesValidas}]`);
        }

        const nombreTemp = uuidv4() + '.' + extensiones;
        const uploadPath = path.join(__dirname , '../uploads/', carpeta ,nombreTemp); //subo con el nombre Temp//archivo.name);

        archivo.mv(uploadPath, (err) =>  {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });
    });

}


module.exports = {
    subirArchivo
}