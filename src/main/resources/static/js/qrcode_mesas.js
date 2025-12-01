// Verifica se é admin (função do auth-guard.js)
if (typeof protegerPagina === "function") {
    protegerPagina('ADMIN');
}

const API_URL = "/api/admin/mesas";

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
                    <button class="btn-qr" onclick="gerarQR(${mesa.id}, ${mesa.numero})">
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

function gerarQR(idMesa, numeroMesa) {
    const modal = document.getElementById('modal-qr');
    const containerQR = document.getElementById('qrcode');
    const tituloMesa = document.getElementById('modal-mesa-num');

    containerQR.innerHTML = "";
    tituloMesa.innerText = numeroMesa;

    // A URL que o cliente vai acessar.
    // Usamos window.location.origin para pegar o IP/Localhost correto automaticamente
    const linkParaOCliente = `${window.location.origin}/cliente/mesa?mesaId=${idMesa}`;

    console.log("Gerando QR para:", linkParaOCliente);

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

// Fechar ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('modal-qr');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}