const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
const {createServer} = require('http'); //Extraemos el metodo de crear server
const { socketController } = require('../sockets/socketController');

class Server{

    constructor(){
        
        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth';
        // this.categoriasPath = '/api/categorias';

        this.paths = {
            auth : '/api/auth',
            buscar: '/api/buscar',
            categorias : '/api/categorias',
            productos: '/api/productos',
            usuarios : '/api/usuarios',
            uploads: '/api/uploads'
        };

        this.PORT = process.env.PORT || 3001;
        this.app = express();
        this.server = createServer(this.app); //Usamos el metodo asi lo asignamos a nuestar app;
        this.io = require('socket.io')(this.server);

        //Conectar DB
        this.conectarDb();
        
        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        //Manejo del socket
        this.socket();
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

        //carga de archivos
        // Note that this option available for versions 1.0.0 and newer. 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //Para crear el directorio en caso de que no exista
        }));
    }

    routes(){

        //Es un middleware que usamos para cargar las rutas
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    socket(){

        this.io.on('connection', (socket)=> socketController(socket, this.io));

    }

    listen(){

        //Cambiamos app por server, ya que express no tiene sockets
        this.server.listen(this.PORT, console.log('Servidor iniciado en el puerto', this.PORT));

        this.app.get('/', (req, res) => {

            //res.sendFile('index.html');
            res.sendFile('index.html');
        });
    }
}

module.exports = Server;