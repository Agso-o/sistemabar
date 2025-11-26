const formulario = document.querySelector("form");
const Inome = document.querySelector(".nome");
const Isenha = document.querySelector(".senha");

function cadastrar() { // end point que era pra ser o de usuários
    fetch("http://localhost:8080/cadastrar", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            nome: Inome.value,
            senha: Isenha.value
        })
    })
    .then(function (res) { console.log(res) })
    .catch(function (res) { console.log(res) })
}

function limpar(){
    Inome.value = "";
    Isenha.value = "";
}

formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    cadastrar();
    limpar();
});