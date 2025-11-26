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
            const errorMsg = await response.text();
            throw new Error('Falha ao abrir mesa: ' + errorMsg);
        }

        const comanda = await response.json();
        comandaAtivaId = comanda.id;
        
        alert(`Mesa ${numeroMesa} aberta! Comanda ID: ${comandaAtivaId}`);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function adicionarItem(event) {
    event.preventDefault();
    if (!comandaAtivaId) {
        alert("Nenhuma comanda ativa. Abra uma mesa primeiro.");
        return;
    }
    
    const itemId = document.getElementById('add-item-codigo').value;
    const quantidade = document.getElementById('add-item-qtd').value;
    const comandaId = comandaAtivaId; 

    try {
        const response = await fetch(`${API_GARCOM_URL}/add-pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comandaId, itemId: parseInt(itemId), quantidade: parseInt(quantidade) })
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error('Falha ao adicionar pedido: ' + errorMsg);
        }

        const pedido = await response.json();
        alert(`Pedido adicionado! (ID: ${pedido.id})`);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function removerItem(event) {
    event.preventDefault();
    const pedidoId = document.getElementById('remover-item-codigo').value;
    const motivo = "Cancelado pelo garçom"; 

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

async function registrarPgto(event) {
    event.preventDefault();
    if (!comandaAtivaId) {
        alert("Nenhuma comanda ativa. Abra uma mesa primeiro.");
        return;
    }
    
    const valor = document.getElementById('pgto-valor').value;
    const comandaId = comandaAtivaId;

    try {
        const response = await fetch(`${API_GARCOM_URL}/pagar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comandaId, valor: parseFloat(valor) })
        });

       if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error('Falha ao registrar pagamento: ' + errorMsg);
        }

        const pagamento = await response.json();
        alert(`Pagamento de R$ ${pagamento.valor} registrado!`);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function adicionarPessoa(event) { event.preventDefault(); alert("A quantidade de pessoas é definida ao 'Abrir a Mesa'."); }
function alternarCouvert(event) { event.preventDefault(); console.log("Função 'Couvert' não implementada no back-end."); }
function fecharConta(event) { event.preventDefault(); console.log("Função 'Fechar Conta' não implementada no back-end."); }