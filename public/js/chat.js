//Referencias html
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');

const url = (window.location.hostname.includes('localhost'))
            ? "http://localhost:3001/api/auth/"
            : "https://palernetappnode1.azurewebsites.net/api/auth/";

let usuario = null;
let socket = null;

const validarJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if(token.length <= 10){

        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    try{
    
        const resp = await fetch(url , {
            headers: {'x-token': token}
        });

        //console.log(await resp.json());

        const {usuario: userDB, token: tokenDB} = await resp.json();
        localStorage.setItem('token', tokenDB);
        usuario = userDB;
        document.title = usuario.nombre;


        await conectarSocket();
        //console.log(userDB);
    }catch(err){

        console.log(err);
    }
}

const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token'),
        }
    });

    socket.on('connect', () => {

        console.log('Sockets on-line');
    });

    socket.on('disconnect', () => {

        console.log('Sockets off-line');
    });

    socket.on('recibir-msg', (mensajes) => {

        console.log(mensajes);
        let listaHtml = '';

        mensajes.forEach(msg => {
            //console.log(msg.uid);
            const {nombre, mensaje} = msg.uid;

            listaHtml += `
                <li class="">${nombre} : ${mensaje}</li>
            `;
        });

        ulMensajes.innerHTML = listaHtml;

    });

    socket.on('usuarios-activos', (usuarios) => {

        console.log(usuarios);

        let listaHtml = '';
        ulUsuarios.innerHTML = '';

        usuarios.forEach(user => {
            
            if(user.email !== usuario.email){

                listaHtml += `
                    <li class="list-group-item">
                        <p class="text-nowrap">
                            <h5 class="text-success">${user.nombre}</h5>
                            <span class="fs-6 text-muted">${user.uid}</span>
                        </p>
                    </li>
                `
            }
        });

        ulUsuarios.innerHTML = listaHtml;

    });
    socket.on('mensaje-privado', (privado) => {

        console.log(privado);
    });
}

txtMensaje.addEventListener('keypress', ({charCode}) => {

    if(charCode !== 13){return;}
    if(txtMensaje.value.length === 0){return;}
    //console.log('Tecla: ', charCode);
    socket.emit('enviar-mensaje', {
        uid: txtUid.value,
        mensaje: txtMensaje.value
    });

    txtMensaje.value = '';
});


const logOut = () => {

    localStorage.clear();

    location = 'index.html';

}

const main = async () => {

    await validarJWT();

}

main();

// const socket = io();

// socket.on('connect', ()=> {

//     socket.emit('nuevo-mesaje', 'Hola mundo');

// });

// socket.on('resp-server', (payload) => {

//     console.log(payload);

// });