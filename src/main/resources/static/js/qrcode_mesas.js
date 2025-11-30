protegerPagina(null);

const API_URL = "http://localhost:8080/api/admin/mesas";

const BASE_URL_CLIENTE = "http://localhost:8080/cliente/mesa";

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
                    <button class="btn-qr" onclick="gerarQR(${mesa.numero})">
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

function gerarQR(numeroMesa) {
    const modal = document.getElementById('modal-qr');
    const containerQR = document.getElementById('qrcode');
    const tituloMesa = document.getElementById('modal-mesa-num');

    containerQR.innerHTML = "";
    tituloMesa.innerText = numeroMesa;

    const linkParaOCliente = `${BASE_URL_CLIENTE}?mesa=${numeroMesa}`;
    
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