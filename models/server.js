const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        
        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth';
        // this.categoriasPath = '/api/categorias';

        this.paths = {
            usuarios : '/api/usuarios',
            auth : '/api/auth',
            categorias : '/api/categorias'
        };

        this.PORT = process.env.PORT || 3001;
        this.app = express();

        //Conectar DB
        this.conectarDb();
        
        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDb(){
        await dbConnection();
    }

    //Middlewares
    middlewares(){
        
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );
    }

    routes(){

        //Es un middleware que usamos para cargar las rutas
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));

    }

    listen(){

        this.app.listen(this.PORT, console.log('Servidor iniciado en el puerto', this.PORT));

        this.app.get('/', (req, res) => {

            //res.sendFile('index.html');
            res.sendFile('index.html');
        });
    }
}

module.exports = Server;