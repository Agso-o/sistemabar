const formulario = document.querySelector("form");
const Iusuario = document.querySelector(".usuario");
const Isenha = document.querySelector(".senha");

function logar() {
    fetch("http://localhost:8080/login", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            login: Iusuario.value,
            senha: Isenha.value
        })
    })
    .then(function (res) {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error("Usuário ou senha incorretos");
        }
    })
    .then(function (data) {
        // Salva o token
        localStorage.setItem('token', data.token);

        // AGORA SALVA O PERFIL REAL QUE VEIO DO JAVA
        localStorage.setItem('perfil', data.perfil);

        // Redireciona
        window.location.href = "/index.html";
    })
    .catch(function (error) {
        console.error(error);
        alert("Erro ao entrar! Verifique seus dados.");
    })
}

formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    logar();
});