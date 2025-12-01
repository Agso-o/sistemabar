document.addEventListener('DOMContentLoaded', () => {
    // Pega o ID da mesa que veio na URL do QR Code (ex: ...?mesaId=1)
    const params = new URLSearchParams(window.location.search);
    const mesaId = params.get('mesaId'); // Atenção: deve ser 'mesaId' para bater com o qrcode.js

    if (mesaId) {
        carregarConsumo(mesaId);
    } else {
        document.querySelector(".box").innerHTML = "<h3 class='texto'>Erro: Nenhuma mesa identificada.</h3>";
    }
});

async function carregarConsumo(mesaId) {
    // USA O NOVO ENDPOINT QUE CRIA NO BACKEND
    // Esse endpoint converte "Mesa ID" -> "Comanda Ativa"
    const urlApi = `/api/cliente/mesa/${mesaId}/atual`;

    try {
        const response = await fetch(urlApi);

        if (!response.ok) {
            // Se der erro (ex: 400 Bad Request), é provável que a mesa esteja fechada
            const msg = await response.text();
            throw new Error(msg || "Mesa fechada ou sem comanda.");
        }

        const data = await response.json();

        // Preenche os dados na tela
        document.getElementById('numero-mesa').innerText = data.numeroMesa;
        document.getElementById('status-conta').innerText = `Status: ${data.status}`;

        // Lista de Itens
        const tbody = document.getElementById('lista-itens');
        tbody.innerHTML = "";

        if (data.itensConsumidos && data.itensConsumidos.length > 0) {
            data.itensConsumidos.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.nome}</td>
                        <td>${item.qtd}</td>
                        <td>R$ ${item.valorTotal.toFixed(2)}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } else {
            tbody.innerHTML = "<tr><td colspan='3' class='texto-info'>Nenhum pedido ainda.</td></tr>";
        }

        // Valores Totais
        document.getElementById('subtotal-comida').innerText = `R$ ${data.subtotalComida.toFixed(2)}`;
        document.getElementById('subtotal-bebida').innerText = `R$ ${data.subtotalBebida.toFixed(2)}`;
        document.getElementById('valor-couvert').innerText = `R$ ${data.couvert.toFixed(2)}`;
        document.getElementById('valor-gorjeta').innerText = `R$ ${data.gorjeta.toFixed(2)}`;
        document.getElementById('valor-pago').innerText = `R$ ${data.totalPago.toFixed(2)}`;

        const saldoElement = document.getElementById('saldo-devedor');
        saldoElement.innerText = `R$ ${data.saldoDevedor.toFixed(2)}`;

        // Se a conta estiver paga, pinta de verde
        if (data.saldoDevedor <= 0.01) {
            saldoElement.style.color = "lightgreen";
            saldoElement.innerText = "PAGO";
        }

    } catch (error) {
        console.error("Erro:", error);
        // Mostra uma mensagem amigável para o cliente
        document.querySelector(".box").innerHTML = `
            <h2 class="texto">Ops!</h2>
            <p class="texto-info" style="text-align: center; margin: 20px 0;">
                ${error.message}
            </p>
            <div style="text-align: center;">
                <a href="/login"><button>Sou Funcionário</button></a>
            </div>
        `;
    }
}