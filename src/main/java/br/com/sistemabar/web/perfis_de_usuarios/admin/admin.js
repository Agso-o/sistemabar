protegerPagina('ADMIN');

setupPanelSwitcher('acao_admin', 'painel-acao', 'painel-');

const API_ADMIN_URL = "http://localhost:8080/api/admin";

function mostrarSubPainel(painelId, mostrar) {
    const painel = document.getElementById(painelId);
    if (painel) {
        painel.style.display = mostrar ? 'flex' : 'none';
    }
}

async function verificarMesa(event) {
    event.preventDefault();
    mostrarSubPainel('mesa-edit-panel', false);
    mostrarSubPainel('mesa-create-panel', true);
}

async function criarMesa(event) {
    event.preventDefault();
    const numeroMesa = document.getElementById('mesa-numero').value;
    const pessoas = document.getElementById('mesa-create-pessoas').value;
    
    try {
        const response = await fetch(`${API_ADMIN_URL}/mesas?numero=${numeroMesa}&pessoas=${pessoas}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error("Falha ao criar/verificar mesa.");
        const mesa = await response.json();
        alert(`Mesa ${mesa.numero} salva com ID ${mesa.id}!`);
    } catch (error) {
        alert(error.message);
    }
}

async function verificarItem(event) {
    event.preventDefault();
    mostrarSubPainel('item-create-panel', true);
    mostrarSubPainel('item-edit-panel', true);
}

async function criarItem(event) {
    event.preventDefault();
    const id = 999; 
    const nome = document.getElementById('item-create-nome').value;
    const preco = document.getElementById('item-create-preco').value;
    const categoria = document.getElementById('item-create-categoria').value;
    const tipo = categoria.toLowerCase() === 'bebida' ? 2 : 3;

    try {
        const response = await fetch(`${API_ADMIN_URL}/cardapio/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, preco, categoria, tipo })
        });
        if (!response.ok) throw new Error("Falha ao criar item.");
        const item = await response.json();
        alert(`Item ${item.nome} criado com ID ${item.id}!`);
    } catch (error) {
        alert(error.message);
    }
}

async function editarItem(event) {
    event.preventDefault();
    const id = document.getElementById('item-codigo').value;
    if (!id) {
        alert("Digite um ID para editar.");
        return;
    }
    
    const nome = document.getElementById('item-new-nome').value;
    const preco = document.getElementById('item-new-preco').value;
    const categoria = document.getElementById('item-new-categoria').value;
    const tipo = categoria.toLowerCase() === 'bebida' ? 2 : 3;

    try {
        const response = await fetch(`${API_ADMIN_URL}/cardapio/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, preco, categoria, tipo })
        });
        if (!response.ok) throw new Error("Falha ao editar item.");
        const item = await response.json();
        alert(`Item ${item.nome} (ID: ${item.id}) atualizado!`);
    } catch (error) {
        alert(error.message);
    }
}

async function definirCouvert(event) {
    event.preventDefault();
    const couvert = document.getElementById('couvert-novo-valor').value;
    
    const gorjetaBebida = document.getElementById('gorjeta-bebidas-nova').value || 0;
    const gorjetaComida = document.getElementById('gorjeta-comidas-nova').value || 0;
    
    try {
        const response = await fetch(`${API_ADMIN_URL}/configuracao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gorjetaBebida, gorjetaComida, couvert })
        });
        if (!response.ok) throw new Error("Falha ao salvar couvert.");
        const config = await response.json();
        document.getElementById('couvert-atual').innerText = config.valorCouvertPessoa.toFixed(2);
        alert("Couvert salvo!");
    } catch (error) {
        alert(error.message);
    }
}

async function definirGorjeta(event) {
    event.preventDefault();
    const gorjetaBebida = document.getElementById('gorjeta-bebidas-nova').value;
    const gorjetaComida = document.getElementById('gorjeta-comidas-nova').value;
    
    const couvert = document.getElementById('couvert-novo-valor').value || 0;

     try {
        const response = await fetch(`${API_ADMIN_URL}/configuracao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gorjetaBebida, gorjetaComida, couvert })
        });
        if (!response.ok) throw new Error("Falha ao salvar gorjetas.");
        const config = await response.json();
        document.getElementById('gorjeta-bebidas-atual').innerText = (config.percentualGorjetaBebida * 100).toFixed(0);
        document.getElementById('gorjeta-comidas-atual').innerText = (config.percentualGorjetaComida * 100).toFixed(0);
        alert("Gorjetas salvas!");
    } catch (error) {
        alert(error.message);
    }
}

async function gerarRelatorio(event) {
    event.preventDefault();
    const inicio = document.getElementById('relatorio-inicio').value + "T00:00:00";
    const fim = document.getElementById('relatorio-fim').value + "T23:59:59";
    
    try {
        const response = await fetch(`${API_ADMIN_URL}/relatorio?inicio=${inicio}&fim=${fim}`, {
            method: 'GET',
        });
        if (!response.ok) throw new Error("Falha ao gerar relatório.");
        
        const rel = await response.json();
        
        document.getElementById('rel-faturamento').innerText = rel.faturamentoTotal.toFixed(2);
        document.getElementById('rel-mais-vendido').innerText = rel.itemMaisVendido;
        document.getElementById('rel-maior-faturamento').innerText = rel.itemMaiorFaturamento;
        
        mostrarSubPainel('relatorio-resultado', true);
    } catch (error) {
        alert(error.message);
    }
}