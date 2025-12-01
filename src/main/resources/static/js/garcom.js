protegerPagina('GARCOM');
setupPanelSwitcher('acao_garcom', 'painel-acao', 'painel-');

const API_GARCOM_URL = "http://localhost:8080/api/garcom";

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

        alert(`Mesa ${numeroMesa} aberta!`);
    } catch (error) {
        alert("Erro: " + error.message);
    }
}

async function adicionarItem(event) {
    event.preventDefault();
    const mesa = document.getElementById('add-item-mesa').value;
    const item = document.getElementById('add-item-codigo').value;
    const qtd = document.getElementById('add-item-qtd').value;

    if (!mesa || !item || !qtd) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch(`${API_GARCOM_URL}/add-pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                numeroMesa: parseInt(mesa),
                numeroItem: parseInt(item),
                quantidade: parseInt(qtd)
            })
        });

        if (!response.ok) throw new Error(await response.text());

        alert(`Item adicionado na Mesa ${mesa}!`);
        // Limpa campos do item e qtd para facilitar o próximo
        document.getElementById('add-item-codigo').value = "";
        document.getElementById('add-item-qtd').value = "";
    } catch (error) {
        alert("Erro: " + error.message);
    }
}

async function registrarPgto(event) {
    event.preventDefault();
    const mesa = document.getElementById('pgto-mesa-numero').value;
    const valor = document.getElementById('pgto-valor').value;

    try {
        const response = await fetch(`${API_GARCOM_URL}/pagar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroMesa: parseInt(mesa), valor: parseFloat(valor) })
        });

       if (!response.ok) throw new Error(await response.text());

        alert(`Pagamento registrado na Mesa ${mesa}!`);
    } catch (error) {
        alert("Erro: " + error.message);
    }
}

async function fecharConta(event) {
    event.preventDefault();
    const mesa = document.getElementById('fechar-mesa-numero').value;

    try {
        const response = await fetch(`${API_GARCOM_URL}/fechar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroMesa: parseInt(mesa) })
        });

        if (!response.ok) throw new Error(await response.text());

        alert(`Conta da Mesa ${mesa} fechada com sucesso!`);
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
            throw new Error(errorMsg);
        }

        alert(`Pedido cancelado.`);
    } catch (error) {
        alert(error.message);
    }
}