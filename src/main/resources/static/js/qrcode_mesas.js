protegerPagina(null); // (Poderia ser 'ADMIN' ou 'GARCOM', deixei null para liberar geral por enquanto)

const API_URL = "http://localhost:8080/api/admin/mesas";

// IMPORTANTE: URL do seu site. Se for testar no celular, use o IP da sua máquina (ex: 192.168.0.x:8080)
// Para testar no PC, localhost serve.
const BASE_URL_CLIENTE = "http://localhost:8080/cliente.html";

document.addEventListener('DOMContentLoaded', () => {
    carregarMesas();
});

async function carregarMesas() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Falha ao buscar mesas");

        const mesas = await response.json();
        const tbody = document.getElementById('tabela-mesas');
        tbody.innerHTML = "";

        mesas.forEach(mesa => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>Mesa ${mesa.numero}</td>
                <td>${mesa.status}</td>
                <td>
                    <button class="btn-qr" onclick="gerarQR(${mesa.numero}, ${mesa.id})">
                        Gerar QR
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        alert("Erro ao buscar lista de mesas.");
    }
}

// Agora recebe o ID da mesa, mas para o QR Code precisamos do ID da COMANDA.
// Como o Admin só vê mesas, aqui geramos um link para a mesa.
// O ClienteController vai ter que ser esperto para achar a comanda aberta dessa mesa.
// *Simplificação:* Vamos mandar o numero da mesa, e o back-end se vira.
function gerarQR(numeroMesa) {
    const modal = document.getElementById('modal-qr');
    const containerQR = document.getElementById('qrcode');
    const tituloMesa = document.getElementById('modal-mesa-num');

    containerQR.innerHTML = "";
    tituloMesa.innerText = numeroMesa;

    // Link: .../cliente.html?mesa=5
    // O Cliente.js vai mandar esse "5" para o backend.
    // OBS: O seu ClienteController atual espera ID DA COMANDA.
    // Você vai precisar ajustar o controller para buscar "Comanda aberta da Mesa X" ou mudar aqui.
    // Para facilitar agora, vamos assumir que o usuário vai ler o ID da comanda.

    // MAS ESPERA: O QR Code é fixo na mesa? Se sim, ele aponta para a mesa.
    // O ideal é o back-end receber o número da mesa e achar a comanda aberta.

    const linkParaOCliente = `${BASE_URL_CLIENTE}?mesa=${numeroMesa}`; // Mandando o ID da mesa (numero)
    
    new QRCode(containerQR, {
        text: linkParaOCliente,
        width: 200,
        height: 200
    });

    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-qr').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal-qr');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}