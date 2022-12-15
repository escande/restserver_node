
const miFormulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
            ? "http://localhost:3001/api/auth/"
            : "https://palernetappnode1.azurewebsites.net/api/auth/";

miFormulario.addEventListener('submit', ev => {

    ev.preventDefault();
    const formData = {};

    for(let el of miFormulario.elements){

        if(el.name.length > 0){

            formData[el.name] = el.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'content-type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(({msg, token}) => {
        if(msg){
            return console.log('Error de login');
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';

    })
    .catch(err => console.log(err));

});

function googleSignin(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    //const responsePayload = decodeJwtResponse(response.credential);

    //Google token: ID_TOKEN

    //console.log('ID_TOKEN', response.credential);

    //Siempre hay que serialixar el body  el body
    var raw = JSON.stringify({
         "id_token": response.credential
     });

    const requestOptions = {
     method: 'POST',
     headers: {
         'content-type': 'application/json'
     },
     body: raw,
     redirect: 'follow'
     };

    fetch(url + 'google', requestOptions)
     .then(resp => resp.json())
     //.then(result => {
    .then(({token}) => { //Solo extraigo el token
         //console.log(token);
         localStorage.setItem('token', token);
         window.location = 'chat.html';
     })
     .catch(error => console.warn('error', error));

 //    console.log("ID: " + responsePayload.sub);
 //    console.log('Full Name: ' + responsePayload.name);
 //    console.log('Given Name: ' + responsePayload.given_name);
 //    console.log('Family Name: ' + responsePayload.family_name);
 //    console.log("Image URL: " + responsePayload.picture);
 //    console.log("Email: " + responsePayload.email);

 }

 //const button = document.querySelector('#google-signout');
 const signOut = () => {

     console.log(google.accounts.id);
     google.accounts.id.disableAutoSelect();
     google.accounts.id.revoke(localStorage.getItem('email'), done =>{

         localStorage.clear();
         localStorage.reload;

         window.location.reload();
     });

 }