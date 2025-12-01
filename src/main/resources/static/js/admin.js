protegerPagina('ADMIN');
setupPanelSwitcher('acao_admin', 'painel-acao', 'painel-');

const API_ADMIN_URL = "http://localhost:8080/api/admin";

// Carregar configurações assim que a página abrir
document.addEventListener('DOMContentLoaded', () => {
    carregarConfiguracoes();
});

function mostrarSubPainel(painelId, mostrar) {
    const painel = document.getElementById(painelId);
    if (painel) {
        painel.style.display = mostrar ? 'flex' : 'none';
    }
}

// --- CONFIGURAÇÕES GLOBAIS (Carregar e Salvar) ---

// Variável para guardar o estado atual da configuração e não zerar campos
let configAtual = {
    percentualGorjetaBebida: 0,
    percentualGorjetaComida: 0,
    valorCouvertPessoa: 0
};

async function carregarConfiguracoes() {
    try {
        const response = await fetch(`${API_ADMIN_URL}/configuracoes`);
        if (response.ok) {
            const config = await response.json();
            configAtual = config; // Salva na memória

            // Atualiza a tela
            if(document.getElementById('couvert-atual')) 
                document.getElementById('couvert-atual').innerText = config.valorCouvertPessoa.toFixed(2);
            
            if(document.getElementById('gorjeta-bebidas-atual')) 
                document.getElementById('gorjeta-bebidas-atual').innerText = (config.percentualGorjetaBebida * 100).toFixed(0);
            
            if(document.getElementById('gorjeta-comidas-atual')) 
                document.getElementById('gorjeta-comidas-atual').innerText = (config.percentualGorjetaComida * 100).toFixed(0);
        }
    } catch (error) {
        console.error("Erro ao carregar configs:", error);
    }
}

async function definirCouvert(event) {
    event.preventDefault();
    const novoValor = document.getElementById('couvert-novo-valor').value;
    
    if(!novoValor) { alert("Digite um valor."); return; }

    // Atualiza APENAS o couvert no objeto atual
    configAtual.valorCouvertPessoa = parseFloat(novoValor);

    salvarConfigNoServidor();
}

async function definirGorjeta(event) {
    event.preventDefault();
    const novaBebida = document.getElementById('gorjeta-bebidas-nova').value;
    const novaComida = document.getElementById('gorjeta-comidas-nova').value;

    if(novaBebida) configAtual.percentualGorjetaBebida = parseFloat(novaBebida) / 100.0;
    if(novaComida) configAtual.percentualGorjetaComida = parseFloat(novaComida) / 100.0;

    salvarConfigNoServidor();
}

async function salvarConfigNoServidor() {
    try {
        const response = await fetch(`${API_ADMIN_URL}/configuracoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(configAtual)
        });
        if (!response.ok) throw new Error("Erro ao salvar.");
        
        alert("Configurações atualizadas com sucesso!");
        carregarConfiguracoes(); // Recarrega para confirmar
    } catch (error) {
        alert(error.message);
    }
}

// --- LOGICA DE MESAS ---
async function verificarMesa(event) {
    event.preventDefault();
    const numeroMesa = document.getElementById('mesa-numero').value;
    if(!numeroMesa) { alert("Digite o número da mesa"); return; }
    mostrarSubPainel('mesa-edit-panel', false);
    mostrarSubPainel('mesa-create-panel', false);
    try {
        const response = await fetch(`${API_ADMIN_URL}/mesas/buscar?numero=${numeroMesa}`);
        if (response.status === 404) {
            mostrarSubPainel('mesa-create-panel', true);
        } else if (response.ok) {
            const mesa = await response.json();
            document.getElementById('mesa-edit-id').value = mesa.id;
            document.getElementById('mesa-edit-numero').value = mesa.numero;
            document.getElementById('mesa-edit-status').value = mesa.status;
            mostrarSubPainel('mesa-edit-panel', true);
        }
    } catch (error) { alert("Erro."); }
}
async function criarMesa(event) {
    event.preventDefault();
    const numeroMesa = document.getElementById('mesa-numero').value;
    try {
        const response = await fetch(`${API_ADMIN_URL}/mesas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero: parseInt(numeroMesa), status: 'FECHADA' })
        });
        if (!response.ok) throw new Error("Erro.");
        alert("Mesa Criada!");
        window.location.reload();
    } catch (error) { alert(error.message); }
}
async function editarMesa(event) {
    event.preventDefault();
    const id = document.getElementById('mesa-edit-id').value;
    const numero = document.getElementById('mesa-edit-numero').value;
    const status = document.getElementById('mesa-edit-status').value;
    try {
        const response = await fetch(`${API_ADMIN_URL}/mesas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(id), numero: parseInt(numero), status: status })
        });
        if (!response.ok) throw new Error("Erro.");
        alert("Mesa Atualizada!");
        window.location.reload();
    } catch (error) { alert(error.message); }
}
async function deletarMesa() {
    const id = document.getElementById('mesa-edit-id').value;
    if(!confirm("Excluir mesa?")) return;
    try {
        const response = await fetch(`${API_ADMIN_URL}/mesas/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Erro.");
        alert("Mesa Excluída!");
        window.location.reload();
    } catch (error) { alert(error.message); }
}

// --- LOGICA DE CARDÁPIO ---
async function verificarItem(event) {
    event.preventDefault();
    const numero = document.getElementById('item-codigo').value;
    if (!numero) { alert("Digite o Código do item."); return; }
    mostrarSubPainel('item-create-panel', false);
    mostrarSubPainel('item-edit-panel', false);
    try {
        const response = await fetch(`${API_ADMIN_URL}/cardapio/buscar?numero=${numero}`);
        if (response.status === 404) {
            mostrarSubPainel('item-create-panel', true);
            document.getElementById('item-create-numero').value = numero;
        } else if (response.ok) {
            const item = await response.json();
            document.getElementById('item-edit-id').value = item.id;
            document.getElementById('item-edit-numero').value = item.numero;
            document.getElementById('item-edit-nome').value = item.nome;
            document.getElementById('item-edit-preco').value = item.preco;
            document.getElementById('item-edit-tipo-select').value = item.tipo;
            document.getElementById('item-status-label').innerText = item.ativo ? "ATIVO" : "INATIVO";
            mostrarSubPainel('item-edit-panel', true);
        }
    } catch (error) { alert("Erro."); }
}
async function criarItem(event) {
    event.preventDefault();
    const numero = document.getElementById('item-create-numero').value;
    const nome = document.getElementById('item-create-nome').value;
    const preco = document.getElementById('item-create-preco').value;
    const tipoVal = document.getElementById('item-create-tipo-select').value;
    const categoria = tipoVal == '2' ? 'Bebida' : 'Comida';
    try {
        const response = await fetch(`${API_ADMIN_URL}/cardapio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                numero: parseInt(numero),
                nome: nome, 
                preco: parseFloat(preco), 
                tipo: parseInt(tipoVal),
                categoria: categoria 
            })
        });
        if (!response.ok) throw new Error(await response.text());
        alert(`Item ${nome} criado!`);
        window.location.reload();
    } catch (error) { alert(error.message); }
}
async function editarItem(event) {
    event.preventDefault();
    const id = document.getElementById('item-edit-id').value;
    const numero = document.getElementById('item-edit-numero').value;
    const nome = document.getElementById('item-edit-nome').value;
    const preco = document.getElementById('item-edit-preco').value;
    const tipoVal = document.getElementById('item-edit-tipo-select').value;
    const categoria = tipoVal == '2' ? 'Bebida' : 'Comida';
    try {
        const response = await fetch(`${API_ADMIN_URL}/cardapio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: parseInt(id), 
                numero: parseInt(numero),
                nome: nome, 
                preco: parseFloat(preco), 
                tipo: parseInt(tipoVal),
                categoria: categoria,
                ativo: true 
            })
        });
        if (!response.ok) throw new Error(await response.text());
        alert(`Item atualizado!`);
        window.location.reload();
    } catch (error) { alert(error.message); }
}
async function deletarItem() {
    const id = document.getElementById('item-edit-id').value;
    if(!confirm("Inativar item?")) return;
    try {
        const response = await fetch(`${API_ADMIN_URL}/cardapio/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Erro.");
        alert("Item Inativado!");
        window.location.reload();
    } catch (error) { alert(error.message); }
}

// --- RELATÓRIOS ---
async function gerarRelatorio(event) {
    event.preventDefault();
    const inicio = document.getElementById('relatorio-inicio').value + "T00:00:00";
    const fim = document.getElementById('relatorio-fim').value + "T23:59:59";
    try {
        const response = await fetch(`${API_ADMIN_URL}/relatorio/faturamento?inicio=${inicio}&fim=${fim}`);
        if (!response.ok) throw new Error("Erro.");
        const fat = await response.json();
        document.getElementById('rel-faturamento').innerText = fat.toFixed(2);
        mostrarSubPainel('relatorio-resultado', true);
    } catch (error) { alert(error.message); }
}