const formulario = document.querySelector("form");
const perfilSelect = document.getElementById("login-perfil");
const senhaInput = document.getElementById("login-senha");
const senhaContainer = document.getElementById("campo-senha-container");

function alternarCampos() {
    const perfil = perfilSelect.value;

    if (perfil === 'CLIENTE') {
        senhaContainer.style.display = 'none'; // Esconde a senha
    } else {
        senhaContainer.style.display = 'block'; // Mostra a senha
    }
}

// Executa uma vez ao carregar para garantir o estado inicial
document.addEventListener('DOMContentLoaded', alternarCampos);

async function processarEntrada() {
    const perfil = perfilSelect.value;

    // --- LÓGICA DO CLIENTE ---
    if (perfil === 'CLIENTE') {
        // Como o cliente não tem login, simulamos a entrada pedindo a mesa
        // Se você preferir ir para uma tela genérica, apenas redirecione para '/cliente/mesa'
        const mesa = prompt("Por favor, digite o número da sua mesa:");
        if (mesa) {
            window.location.href = `/cliente/mesa?mesa=${mesa}`;
        }
        return;
    }

    // --- LÓGICA DO STAFF (ADMIN/GARÇOM) ---
    // Define o usuário automaticamente baseado no perfil selecionado
    // (Já que você pediu para ser fixo: 'garcom' ou 'admin')
    let loginUsuario = "";
    if (perfil === 'ADMIN') loginUsuario = "admin";
    if (perfil === 'GARCOM') loginUsuario = "garcom";

    const senha = senhaInput.value;

    if (!senha) {
        alert("Por favor, digite a senha.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/login", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                login: loginUsuario,
                senha: senha
            })
        });

        if (response.ok) {
            const data = await response.json();
            // Verifica se o perfil que voltou do banco bate com o que a pessoa selecionou
            if (data.perfil !== perfil) {
                alert(`Erro: Você tentou entrar como ${perfil}, mas este usuário é ${data.perfil}`);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('perfil', data.perfil);
            window.location.href = "/"; // Vai para a home logada
        } else {
            throw new Error("Senha incorreta.");
        }
    } catch (error) {
        console.error(error);
        alert("Falha ao entrar: " + error.message);
    }
}

formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    processarEntrada();
});