document.addEventListener('DOMContentLoaded', () => {
    // Pega o parametro ?mesa=1 da URL
    const params = new URLSearchParams(window.location.search);

    // ATENÇÃO: Seu QR Code envia ?mesa=ID_DA_COMANDA.
    // O ClienteController espera o ID da Comanda.
    const comandaId = params.get('mesa');

    if (comandaId) {
        carregarConsumo(comandaId);
    } else {
        document.getElementById('numero-mesa').innerText = "(Inválida)";
        alert("Nenhuma comanda selecionada.");
    }
});

async function carregarConsumo(comandaId) {
    // URL que criamos no ClienteController.java
    const urlApi = `http://localhost:8080/api/cliente/extrato/${comandaId}`;

    try {
        const response = await fetch(urlApi);

        if (!response.ok) {
            throw new Error('Erro ao buscar comanda. Talvez ela não exista ou já esteja fechada.');
        }

        const data = await response.json(); // Pega o ExtratoDTO do Java

        // Preenche o número da mesa no título
        document.getElementById('numero-mesa').innerText = data.numeroMesa;

        // Preenche a tabela de itens
        const tbody = document.getElementById('lista-itens');
        tbody.innerHTML = "";

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

        // Preenche os valores do sumário
        document.getElementById('subtotal-comida').innerText = `R$ ${data.subtotalComida.toFixed(2)}`;
        document.getElementById('subtotal-bebida').innerText = `R$ ${data.subtotalBebida.toFixed(2)}`;
        document.getElementById('valor-couvert').innerText = `R$ ${data.couvert.toFixed(2)}`;
        document.getElementById('valor-gorjeta').innerText = `R$ ${data.gorjeta.toFixed(2)}`;
        document.getElementById('valor-pago').innerText = `R$ ${data.totalPago.toFixed(2)}`;
        document.getElementById('saldo-devedor').innerText = `R$ ${data.saldoDevedor.toFixed(2)}`;

        document.getElementById('status-conta').innerText = `Status: ${data.status}`;

    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('numero-mesa').innerText = "Erro";
        alert("Não foi possível carregar os dados. " + error.message);
    }
}