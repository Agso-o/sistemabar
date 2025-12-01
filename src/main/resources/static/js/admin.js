// Verifica se é admin
if (typeof protegerPagina === "function") {
    protegerPagina('ADMIN');
}

let mesaEmEdicao = null;
let itemEmEdicao = null;

// --- 1. GERENCIAR MESAS ---

async function verificarMesa(event) {
    event.preventDefault();
    const numeroMesa = document.getElementById('mesa-numero').value;
    if (!numeroMesa) return alert("Digite o número!");

    try {
        const response = await fetch('/api/admin/mesas');
        const mesas = await response.json();
        const mesaEncontrada = mesas.find(m => m.numero == numeroMesa);

        document.getElementById('mesa-create-panel').style.display = 'none';
        document.getElementById('mesa-edit-panel').style.display = 'none';

        if (mesaEncontrada) {
            mesaEmEdicao = mesaEncontrada;
            // Preenche o formulário de edição
            document.getElementById('mesa-edit-id').value = mesaEncontrada.id;
            document.getElementById('mesa-edit-numero').value = mesaEncontrada.numero;
            document.getElementById('mesa-edit-status').value = mesaEncontrada.status; // Vai bater com FECHADA ou ABERTA
            
            // Configura botão de excluir
            document.getElementById('btn-excluir-mesa').onclick = () => deletarMesa(mesaEncontrada.id);

            document.getElementById('mesa-edit-panel').style.display = 'block';
        } else {
            document.getElementById('mesa-create-panel').style.display = 'block';
        }
    } catch (e) { console.error(e); alert("Erro ao buscar mesas."); }
}

async function criarMesa(event) {
    event.preventDefault();
    const numero = document.getElementById('mesa-numero').value;

    try {
        const response = await fetch('/api/admin/mesas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                numero: numero, 
                status: 'FECHADA' // Padrão: Disponível
            })
        });
        if (response.ok) { alert("Mesa criada!"); location.reload(); } 
        else { alert("Erro: " + await response.text()); }
    } catch (e) { console.error(e); }
}

async function editarMesa(event) {
    event.preventDefault();
    const id = document.getElementById('mesa-edit-id').value;
    const numero = document.getElementById('mesa-edit-numero').value;
    const status = document.getElementById('mesa-edit-status').value;

    try {
        const response = await fetch('/api/admin/mesas', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(id), numero: parseInt(numero), status: status })
        });
        if (response.ok) { alert("Mesa atualizada!"); location.reload(); }
        else { alert("Erro ao atualizar: " + await response.text()); }
    } catch (e) { console.error(e); }
}

async function deletarMesa(id) {
    if(!confirm("Excluir esta mesa?")) return;
    try {
        const response = await fetch(`/api/admin/mesas/${id}`, { method: 'DELETE' });
        if (response.ok) { alert("Mesa excluída!"); location.reload(); }
        else { alert("Erro ao excluir: " + await response.text()); }
    } catch (e) { console.error(e); }
}


// --- 2. GERENCIAR CARDÁPIO ---

async function verificarItem(event) {
    event.preventDefault();
    const codigo = document.getElementById('item-codigo').value;
    if(!codigo) return alert("Digite o código!");

    try {
        const res = await fetch('/api/admin/cardapio');
        const itens = await res.json();
        
        // Procura pelo ID
        const item = itens.find(i => i.id == codigo);

        document.getElementById('item-create-panel').style.display = 'none';
        document.getElementById('item-edit-panel').style.display = 'none';

        if (item) {
            itemEmEdicao = item;
            document.getElementById('item-edit-id').value = item.id;
            document.getElementById('item-edit-numero').value = item.id;
            document.getElementById('item-edit-nome').value = item.nome;
            document.getElementById('item-edit-preco').value = item.preco;
            document.getElementById('item-edit-tipo-select').value = item.tipo;
            
            // Configura botão de excluir
            document.getElementById('btn-excluir-item').onclick = () => deletarItem(item.id);

            document.getElementById('item-edit-panel').style.display = 'block';
        } else {
            // Criação
            document.getElementById('item-create-panel').style.display = 'block';
        }
    } catch (e) { console.error(e); }
}

async function criarItem(event) {
    event.preventDefault();
    const nome = document.getElementById('item-create-nome').value;
    const preco = document.getElementById('item-create-preco').value;
    const tipo = document.getElementById('item-create-tipo-select').value;
    
    const categoria = tipo == 2 ? "Bebidas" : (tipo == 3 ? "Comidas" : "Outros");

    try {
        const response = await fetch('/api/admin/cardapio', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nome, preco, tipo, categoria })
        });
        if(response.ok) { alert("Item criado!"); location.reload(); }
        else { alert("Erro ao criar."); }
    } catch (e) { console.error(e); }
}

async function editarItem(event) {
    event.preventDefault();
    const id = document.getElementById('item-edit-id').value;
    const nome = document.getElementById('item-edit-nome').value;
    const preco = document.getElementById('item-edit-preco').value;
    const tipo = document.getElementById('item-edit-tipo-select').value;
    const categoria = tipo == 2 ? "Bebidas" : (tipo == 3 ? "Comidas" : "Outros");

    try {
        const response = await fetch('/api/admin/cardapio', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id, nome, preco, tipo, categoria })
        });
        if(response.ok) { alert("Item atualizado!"); location.reload(); }
        else { alert("Erro ao atualizar."); }
    } catch (e) { console.error(e); }
}

async function deletarItem(id) {
    if(!confirm("Excluir este item?")) return;
    try {
        const response = await fetch(`/api/admin/cardapio/${id}`, { method: 'DELETE' });
        if(response.ok) { alert("Item excluído!"); location.reload(); }
        else { alert("Erro."); }
    } catch (e) { console.error(e); }
}

// ... (Funções de Config e Relatório mantidas iguais) ...
// (Lembre-se de incluir as funções carregarConfiguracoes, definirCouvert, definirGorjeta, gerarRelatorio aqui)
async function carregarConfiguracoes() {
    try {
        const response = await fetch('/api/admin/configuracoes');
        if (response.ok) {
            const config = await response.json();
            if(document.getElementById('couvert-atual')) 
                document.getElementById('couvert-atual').innerText = config.valorCouvertPessoa.toFixed(2);
            if(document.getElementById('gorjeta-bebidas-atual'))
                document.getElementById('gorjeta-bebidas-atual').innerText = (config.percentualGorjetaBebida * 100).toFixed(0);
            if(document.getElementById('gorjeta-comidas-atual'))
                document.getElementById('gorjeta-comidas-atual').innerText = (config.percentualGorjetaComida * 100).toFixed(0);
            return config;
        }
    } catch (e) {}
    return null;
}

async function definirCouvert(event) {
    event.preventDefault();
    const novoValor = parseFloat(document.getElementById('couvert-novo-valor').value);
    const configAtual = await carregarConfiguracoes();
    if (!configAtual) return;
    configAtual.valorCouvertPessoa = novoValor;
    await salvarConfig(configAtual);
}

async function definirGorjeta(event) {
    event.preventDefault();
    const novaBebida = document.getElementById('gorjeta-bebidas-nova').value;
    const novaComida = document.getElementById('gorjeta-comidas-nova').value;
    const configAtual = await carregarConfiguracoes();
    if (!configAtual) return;
    if (novaBebida) configAtual.percentualGorjetaBebida = parseFloat(novaBebida) / 100;
    if (novaComida) configAtual.percentualGorjetaComida = parseFloat(novaComida) / 100;
    await salvarConfig(configAtual);
}

async function salvarConfig(config) {
    try {
        const response = await fetch('/api/admin/configuracoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        if (response.ok) { alert("Configurações atualizadas!"); location.reload(); }
    } catch (e) {}
}

async function gerarRelatorio(event) {
    event.preventDefault();
    const inicio = document.getElementById('relatorio-inicio').value;
    const fim = document.getElementById('relatorio-fim').value;
    if (!inicio || !fim) return alert("Selecione as datas!");
    const dataInicio = inicio + "T00:00:00";
    const dataFim = fim + "T23:59:59";

    try {
        const resFat = await fetch(`/api/admin/relatorio/faturamento?inicio=${dataInicio}&fim=${dataFim}`);
        const faturamento = await resFat.json();
        document.getElementById('rel-faturamento').innerText = faturamento.toFixed(2);

        const resMais = await fetch(`/api/admin/relatorio/mais-vendidos`);
        const maisVendidos = await resMais.json();
        document.getElementById('rel-mais-vendido').innerText = maisVendidos.length > 0 ? `${maisVendidos[0].nomeItem} (${maisVendidos[0].totalVendido})` : "Sem dados";

        const resMaior = await fetch(`/api/admin/relatorio/maior-faturamento`);
        const maiorFat = await resMaior.json();
        document.getElementById('rel-maior-faturamento').innerText = maiorFat.length > 0 ? `${maiorFat[0].nomeItem} (R$ ${maiorFat[0].faturamentoTotal.toFixed(2)})` : "Sem dados";

        document.getElementById('relatorio-resultado').style.display = 'block';
    } catch (error) { alert("Erro ao gerar relatório."); }
}

document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById('couvert-atual')) carregarConfiguracoes();
});