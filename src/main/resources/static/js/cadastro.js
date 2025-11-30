const formulario = document.querySelector("form");

function cadastrar() {
    const login = document.querySelector(".usuario").value;
    const senha = document.querySelector(".senha").value;
    const perfil = document.querySelector(".perfil").value;

    fetch("http://localhost:8080/cadastrar", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            login: login,
            senha: senha,
            perfil: perfil
        })
    })
    .then(async function (res) {
        if(res.ok) {
            alert("Cadastro realizado com sucesso!");
            window.location.href = "/login.html";
        } else {
            alert("Erro: " + await res.text());
        }
    })
    .catch(function (res) { console.log(res) })
}

formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    cadastrar();
});