protegerPagina('GARCOM');
setupPanelSwitcher('acao_garcom', 'painel-acao', 'painel-');

const API_GARCOM_URL = "http://localhost:8080/api/garcom";
let comandaAtivaId = null;

async function abrirMesa(event) {
    event.preventDefault();
    const numeroMesa = document.getElementById('abrir-mesa-numero').value;
    const pessoas = document.getElementById('abrir-mesa-pessoas').value;

    try {
        const response = await fetch(`${API_GARCOM_URL}/abrir-mesa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroMesa: parseInt(numeroMesa), pessoas: parseInt(pessoas) })
        });

        if (!response.ok) {
            const erro = await response.text();
            throw new Error(erro);
        }

        const comanda = await response.json();
        comandaAtivaId = comanda.id;
        alert(`Mesa ${numeroMesa} aberta! Comanda ID: ${comanda.id}`);
        console.log("Comanda:", comanda);
    } catch (error) {
        alert("Erro: " + error.message);
    }
}

async function adicionarItem(event) {
    event.preventDefault();

    let idParaUsar = document.getElementById('add-item-mesa').value;
    if (!idParaUsar) idParaUsar = comandaAtivaId;

    if (!idParaUsar) {
        alert("Digite o ID da Comanda ou abra uma mesa antes.");
        return;
    }

    const itemId = document.getElementById('add-item-codigo').value;
    const quantidade = document.getElementById('add-item-qtd').value;

    try {
        const response = await fetch(`${API_GARCOM_URL}/add-pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comandaId: parseInt(idParaUsar),
                itemId: parseInt(itemId),
                quantidade: parseInt(quantidade)
            })
        });

        if (!response.ok) throw new Error(await response.text());

        alert(`Item adicionado com sucesso!`);
    } catch (error) {
        alert("Erro: " + error.message);
    }
}

async function registrarPgto(event) {
    event.preventDefault();
    const comandaId = document.getElementById('pgto-mesa-numero').value;
    const valor = document.getElementById('pgto-valor').value;

    try {
        const response = await fetch(`${API_GARCOM_URL}/pagar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comandaId: parseInt(comandaId), valor: parseFloat(valor) })
        });

       if (!response.ok) throw new Error(await response.text());

        alert(`Pagamento registrado!`);
    } catch (error) {
        alert("Erro: " + error.message);
    }
}

async function removerItem(event) {
    event.preventDefault();
    const pedidoId = document.getElementById('remover-item-codigo').value;
    const motivo = document.getElementById('remover-item-motivo').value || "Cancelado pelo garçom";

    try {
        const response = await fetch(`${API_GARCOM_URL}/cancelar-pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pedidoId: parseInt(pedidoId), motivo })
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error('Falha ao cancelar pedido: ' + errorMsg);
        }

        const pedido = await response.json();
        alert(`Pedido ${pedido.id} cancelado.`);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function adicionarPessoa(event) { event.preventDefault(); alert("Use 'Abrir Mesa' para definir pessoas."); }
function alternarCouvert(event) { event.preventDefault(); alert("Funcionalidade futura."); }
function fecharConta(event) { event.preventDefault(); alert("Funcionalidade futura. Use o pagamento para abater o valor."); }