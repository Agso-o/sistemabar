protegerPagina('ADMIN');
setupPanelSwitcher('acao_admin', 'painel-acao', 'painel-');

const API_ADMIN_URL = "http://localhost:8080/api/admin";

document.addEventListener('DOMContentLoaded', () => {
    carregarConfiguracoes();
});

function mostrarSubPainel(painelId, mostrar) {
    const painel = document.getElementById(painelId);
    if (painel) {
        painel.style.display = mostrar ? 'flex' : 'none';
    }
}

// --- CONFIGURAÇÕES GLOBAIS ---
let configAtual = { percentualGorjetaBebida: 0, percentualGorjetaComida: 0, valorCouvertPessoa: 0 };

async function carregarConfiguracoes() {
    try {
        const response = await fetch(`${API_ADMIN_URL}/configuracoes`);
        if (response.ok) {
            const config = await response.json();
            configAtual = config;
            if(document.getElementById('couvert-atual'))
                document.getElementById('couvert-atual').innerText = config.valorCouvertPessoa.toFixed(2);
            if(document.getElementById('gorjeta-bebidas-atual'))
                document.getElementById('gorjeta-bebidas-atual').innerText = (config.percentualGorjetaBebida * 100).toFixed(0);
            if(document.getElementById('gorjeta-comidas-atual'))
                document.getElementById('gorjeta-comidas-atual').innerText = (config.percentualGorjetaComida * 100).toFixed(0);
        }
    } catch (error) { console.error("Erro config:", error); }
}

async function definirCouvert(e) {
    e.preventDefault();
    const val = document.getElementById('couvert-novo-valor').value;
    if(!val) return alert("Digite um valor.");
    configAtual.valorCouvertPessoa = parseFloat(val);
    salvarConfigNoServidor();
}

async function definirGorjeta(e) {
    e.preventDefault();
    const b = document.getElementById('gorjeta-bebidas-nova').value;
    const c = document.getElementById('gorjeta-comidas-nova').value;
    if(b) configAtual.percentualGorjetaBebida = parseFloat(b)/100;
    if(c) configAtual.percentualGorjetaComida = parseFloat(c)/100;
    salvarConfigNoServidor();
}

async function salvarConfigNoServidor() {
    try {
        const res = await fetch(`${API_ADMIN_URL}/configuracoes`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(configAtual)
        });
        if(!res.ok) throw new Error("Erro salvar config");
        alert("Configurações salvas!");
        carregarConfiguracoes();
    } catch(e) { alert(e.message); }
}

// --- MESAS ---
async function verificarMesa(e) {
    e.preventDefault();
    const num = document.getElementById('mesa-numero').value;
    if(!num) return alert("Digite o número.");
    mostrarSubPainel('mesa-edit-panel', false);
    mostrarSubPainel('mesa-create-panel', false);
    try {
        const res = await fetch(`${API_ADMIN_URL}/mesas/buscar?numero=${num}`);
        if(res.status === 404) {
            mostrarSubPainel('mesa-create-panel', true);
        } else if(res.ok) {
            const m = await res.json();
            document.getElementById('mesa-edit-id').value = m.id;
            document.getElementById('mesa-edit-numero').value = m.numero;
            document.getElementById('mesa-edit-status').value = m.status;
            mostrarSubPainel('mesa-edit-panel', true);
        }
    } catch(err) { alert("Erro ao verificar."); }
}

async function criarMesa(e) {
    e.preventDefault();
    const num = document.getElementById('mesa-numero').value;
    try {
        const res = await fetch(`${API_ADMIN_URL}/mesas`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({numero: parseInt(num), status: 'FECHADA'})
        });
        if(!res.ok) throw new Error("Erro criar.");
        alert("Mesa criada!");
        window.location.reload();
    } catch(err) { alert(err.message); }
}

async function editarMesa(e) {
    e.preventDefault();
    const id = document.getElementById('mesa-edit-id').value;
    const num = document.getElementById('mesa-edit-numero').value;
    const st = document.getElementById('mesa-edit-status').value;
    try {
        const res = await fetch(`${API_ADMIN_URL}/mesas`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: parseInt(id), numero: parseInt(num), status: st})
        });
        if(!res.ok) throw new Error("Erro editar.");
        alert("Mesa atualizada!");
        window.location.reload();
    } catch(err) { alert(err.message); }
}

async function deletarMesa() {
    const id = document.getElementById('mesa-edit-id').value;
    if(!confirm("Excluir?")) return;
    try {
        const res = await fetch(`${API_ADMIN_URL}/mesas/${id}`, {method: 'DELETE'});
        if(!res.ok) throw new Error("Erro deletar (mesa deve estar fechada).");
        alert("Excluída!");
        window.location.reload();
    } catch(err) { alert(err.message); }
}

// --- CARDÁPIO ---
async function verificarItem(e) {
    e.preventDefault();
    const num = document.getElementById('item-codigo').value;
    if(!num) return alert("Digite o código.");
    mostrarSubPainel('item-create-panel', false);
    mostrarSubPainel('item-edit-panel', false);
    try {
        const res = await fetch(`${API_ADMIN_URL}/cardapio/buscar?numero=${num}`);
        if(res.status === 404) {
            mostrarSubPainel('item-create-panel', true);
            document.getElementById('item-create-numero').value = num;
        } else if(res.ok) {
            const i = await res.json();
            document.getElementById('item-edit-id').value = i.id;
            document.getElementById('item-edit-numero').value = i.numero;
            document.getElementById('item-edit-nome').value = i.nome;
            document.getElementById('item-edit-preco').value = i.preco;
            document.getElementById('item-edit-tipo-select').value = i.tipo;
            document.getElementById('item-status-label').innerText = i.ativo ? "ATIVO" : "INATIVO";
            mostrarSubPainel('item-edit-panel', true);
        }
    } catch(err) { alert("Erro."); }
}

async function criarItem(e) {
    e.preventDefault();
    const num = document.getElementById('item-create-numero').value;
    const nome = document.getElementById('item-create-nome').value;
    const preco = document.getElementById('item-create-preco').value;
    const tipo = document.getElementById('item-create-tipo-select').value;
    const cat = tipo == '2' ? 'Bebida' : 'Comida';
    try {
        const res = await fetch(`${API_ADMIN_URL}/cardapio`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({numero: parseInt(num), nome: nome, preco: parseFloat(preco), tipo: parseInt(tipo), categoria: cat})
        });
        if(!res.ok) throw new Error("Erro criar.");
        alert("Item criado!");
        window.location.reload();
    } catch(err) { alert(err.message); }
}

async function editarItem(e) {
    e.preventDefault();
    const id = document.getElementById('item-edit-id').value;
    const num = document.getElementById('item-edit-numero').value;
    const nome = document.getElementById('item-edit-nome').value;
    const preco = document.getElementById('item-edit-preco').value;
    const tipo = document.getElementById('item-edit-tipo-select').value;
    const cat = tipo == '2' ? 'Bebida' : 'Comida';
    try {
        const res = await fetch(`${API_ADMIN_URL}/cardapio`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: parseInt(id), numero: parseInt(num), nome: nome, preco: parseFloat(preco), tipo: parseInt(tipo), categoria: cat, ativo: true})
        });
        if(!res.ok) throw new Error("Erro editar.");
        alert("Item atualizado!");
        window.location.reload();
    } catch(err) { alert(err.message); }
}

async function deletarItem() {
    const id = document.getElementById('item-edit-id').value;
    if(!confirm("Inativar?")) return;
    try {
        const res = await fetch(`${API_ADMIN_URL}/cardapio/${id}`, {method: 'DELETE'});
        if(!res.ok) throw new Error("Erro.");
        alert("Inativado!");
        window.location.reload();
    } catch(err) { alert(err.message); }
}

// --- RELATÓRIOS (AGORA COM DATAS EM TODOS OS FETCHES) ---
async function gerarRelatorio(event) {
    event.preventDefault();
    const inicio = document.getElementById('relatorio-inicio').value + "T00:00:00";
    const fim = document.getElementById('relatorio-fim').value + "T23:59:59";

    document.getElementById('rel-faturamento').innerText = "Carregando...";
    document.getElementById('rel-mais-vendido').innerText = "...";
    document.getElementById('rel-maior-faturamento').innerText = "...";
    mostrarSubPainel('relatorio-resultado', true);

    try {
        // 1. FATURAMENTO
        const resFat = await fetch(`${API_ADMIN_URL}/relatorio/faturamento?inicio=${inicio}&fim=${fim}`);
        if(resFat.ok) {
            const text = await resFat.text();
            const val = text ? JSON.parse(text) : 0.0;
            document.getElementById('rel-faturamento').innerText = val.toFixed(2);
        }

        // 2. MAIS VENDIDOS (AGORA USA DATA)
        const resQtd = await fetch(`${API_ADMIN_URL}/relatorio/mais-vendidos?inicio=${inicio}&fim=${fim}`);
        if(resQtd.ok) {
            const lista = await resQtd.json();
            if(lista && lista.length > 0) {
                const top1 = lista[0];
                document.getElementById('rel-mais-vendido').innerText = `${top1.nomeItem} (${top1.totalVendido} un)`;
            } else {
                document.getElementById('rel-mais-vendido').innerText = "Nenhum registro";
            }
        }

        // 3. MAIOR FATURAMENTO (AGORA USA DATA)
        const resLucro = await fetch(`${API_ADMIN_URL}/relatorio/maior-faturamento?inicio=${inicio}&fim=${fim}`);
        if(resLucro.ok) {
            const lista = await resLucro.json();
            if(lista && lista.length > 0) {
                const top1 = lista[0];
                document.getElementById('rel-maior-faturamento').innerText = `${top1.nomeItem} (R$ ${top1.faturamentoTotal.toFixed(2)})`;
            } else {
                document.getElementById('rel-maior-faturamento').innerText = "Nenhum registro";
            }
        }

    } catch (error) {
        alert("Erro ao gerar relatório: " + error.message);
    }
}