document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const mesaId = params.get('mesa');

    if (mesaId) {
        document.getElementById('numero-mesa').innerText = mesaId;
        carregarConsumo(mesaId);
    } else {
        document.getElementById('numero-mesa').innerText = "(Inválida)";
        alert("Nenhuma mesa selecionada.");
    }
});

async function carregarConsumo(mesaId) {
    const urlApi = `http://localhost:8080/api/mesas/${mesaId}/extrato`;

    try {
        const data = {
            itensConsumidos: [
                { nome: "Cerveja", qtd: 2, valorTotal: 20.00 },
                { nome: "Porção de Fritas", qtd: 1, valorTotal: 30.00 },
                { nome: "Refrigerante", qtd: 1, valorTotal: 8.00 }
            ],
            subtotalComida: 30.00,
            subtotalBebida: 28.00,
            couvert: 10.00,
            gorjeta: 7.30,
            totalPago: 25.00,
            status: "OCUPADA"
        };

        const totalBruto = data.subtotalComida + data.subtotalBebida + data.couvert + data.gorjeta;
        const saldoDevedor = totalBruto - data.totalPago;

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

        document.getElementById('subtotal-comida').innerText = `R$ ${data.subtotalComida.toFixed(2)}`;
        document.getElementById('subtotal-bebida').innerText = `R$ ${data.subtotalBebida.toFixed(2)}`;
        document.getElementById('valor-couvert').innerText = `R$ ${data.couvert.toFixed(2)}`;
        document.getElementById('valor-gorjeta').innerText = `R$ ${data.gorjeta.toFixed(2)}`;
        
        document.getElementById('valor-pago').innerText = `R$ ${data.totalPago.toFixed(2)}`;
        document.getElementById('saldo-devedor').innerText = `R$ ${saldoDevedor.toFixed(2)}`;
        
        document.getElementById('status-conta').innerText = `Status: ${data.status}`;

    } catch (error) {
        console.error("Erro ao buscar dados da mesa:", error);
        alert("Não foi possível carregar os dados da mesa.");
    }
}