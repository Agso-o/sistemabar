document.addEventListener('DOMContentLoaded', () => {
    // Tenta pegar 'mesa' (padrão novo) ou 'mesaNumero' (padrão antigo)
    const params = new URLSearchParams(window.location.search);
    const mesaNumero = params.get('mesa') || params.get('mesaNumero');

    if (mesaNumero) {
        carregarConsumo(mesaNumero);
    } else {
        document.querySelector(".box").innerHTML = "<h3 class='texto'>Erro: Nenhuma mesa identificada na URL.</h3>";
    }
});

async function carregarConsumo(mesaNumero) {
    // Chama o endpoint que busca pelo NÚMERO DA MESA
    const urlApi = `/api/cliente/mesa/numero/${mesaNumero}/atual`;

    try {
        const response = await fetch(urlApi);

        if (!response.ok) {
            // Se der erro (mesa fechada ou não existe), pega a mensagem do back-end
            const msg = await response.text();
            throw new Error(msg);
        }

        const data = await response.json();

        // AQUI ESTÁ A CHAMADA QUE ESTAVA DANDO ERRO
        renderizarComanda(data);

    } catch (error) {
        console.error("Erro:", error);

        // Mostra mensagem amigável na tela
        document.querySelector(".box").innerHTML = `
            <h2 class="texto">Mesa ${mesaNumero}</h2>
            <div style="text-align: center; margin-top: 30px;">
                <p class="texto-info" style="color: #ff6b6b; font-weight: bold;">
                    ${error.message.includes("Unexpected") ? "Mesa fechada ou sem conta aberta." : error.message}
                </p>
                <br>
                <p class="texto" style="font-size: 14px;">Peça ao garçom para abrir a mesa.</p>
                <br>
                <a href="/login"><button>Sou Funcionário</button></a>
            </div>
        `;
    }
}

// --- ESTA É A FUNÇÃO QUE FALTAVA ---
function renderizarComanda(data) {
    // 1. Preenche cabeçalho
    document.getElementById("numero-mesa").innerText = data.numeroMesa;

    const statusElem = document.getElementById("status-conta");
    if(statusElem) statusElem.innerText = `Status: ${data.status}`;

    // 2. Preenche lista de itens
    const tbody = document.getElementById("lista-itens");
    tbody.innerHTML = "";

    if (data.itensConsumidos && data.itensConsumidos.length > 0) {
        data.itensConsumidos.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.qtd}</td>
                <td>R$ ${item.valorTotal.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = "<tr><td colspan='3' style='text-align:center'>Nenhum pedido ainda.</td></tr>";
    }

    // 3. Preenche totais
    // (Verifica se o elemento existe antes de tentar mudar, para evitar erros se o HTML mudar)
    if(document.getElementById("subtotal-comida"))
        document.getElementById("subtotal-comida").innerText = `R$ ${data.subtotalComida.toFixed(2)}`;

    if(document.getElementById("subtotal-bebida"))
        document.getElementById("subtotal-bebida").innerText = `R$ ${data.subtotalBebida.toFixed(2)}`;

    if(document.getElementById("valor-couvert"))
        document.getElementById("valor-couvert").innerText = `R$ ${data.couvert.toFixed(2)}`;

    if(document.getElementById("valor-gorjeta"))
        document.getElementById("valor-gorjeta").innerText = `R$ ${data.gorjeta.toFixed(2)}`;

    if(document.getElementById("valor-pago"))
        document.getElementById("valor-pago").innerText = `R$ ${data.totalPago.toFixed(2)}`;

    const saldoElement = document.getElementById("saldo-devedor");
    if(saldoElement) {
        saldoElement.innerText = `R$ ${data.saldoDevedor.toFixed(2)}`;

        // Pinta o saldo de verde se for 0 (Pago)
        if (data.saldoDevedor <= 0.01) {
            saldoElement.style.color = "lightgreen";
            saldoElement.innerText = "PAGO";
        } else {
            saldoElement.style.color = "white"; // ou a cor original
        }
    }
}