protegerPagina('ADMIN');

setupPanelSwitcher('acao_admin', 'painel-acao', 'painel-');

const API_ADMIN_URL = "http://localhost:8080/api/admin";

function mostrarSubPainel(painelId, mostrar) {
    const painel = document.getElementById(painelId);
    if (painel) {
        painel.style.display = mostrar ? 'flex' : 'none';
    }
}

// --- LOGICA DE MESAS (REFEITA) ---

async function verificarMesa(event) {
    event.preventDefault();
    const numeroMesa = document.getElementById('mesa-numero').value;

    if(!numeroMesa) { alert("Digite o número da mesa"); return; }

    // Esconde tudo antes de mostrar o certo
    mostrarSubPainel('mesa-edit-panel', false);
    mostrarSubPainel('mesa-create-panel', false);

    try {
        const response = await fetch(`${API_ADMIN_URL}/mesas/buscar?numero=${numeroMesa}`);

        if (response.status === 404) {
            // Mesa NÃO existe -> Mostra painel de Criar
            mostrarSubPainel('mesa-create-panel', true);
        } else if (response.ok) {
            // Mesa EXISTE -> Mostra painel de Editar e preenche os dados
            const mesa = await response.json();

            document.getElementById('mesa-edit-id').value = mesa.id;
            document.getElementById('mesa-edit-numero').value = mesa.numero;
            document.getElementById('mesa-edit-status').value = mesa.status; // Vai vir "FECHADA" ou "ABERTA"

            mostrarSubPainel('mesa-edit-panel', true);
        } else {
            throw new Error("Erro desconhecido ao buscar mesa.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao verificar mesa.");
    }
}

async function criarMesa(event) {
    event.preventDefault();
    const numeroMesa = document.getElementById('mesa-numero').value;

    // Cria mesa com status padrão FECHADA
    const payload = {
        numero: parseInt(numeroMesa),
        status: 'FECHADA'
    };

    try {
        const response = await fetch(`${API_ADMIN_URL}/mesas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Falha ao criar mesa. Verifique se o número já existe.");

        const mesa = await response.json();
        alert(`Mesa ${mesa.numero} cadastrada com sucesso!`);
        window.location.reload(); // Recarrega para limpar
    } catch (error) {
        alert(error.message);
    }
}

async function editarMesa(event) {
    event.preventDefault();
    const id = document.getElementById('mesa-edit-id').value;
    const numero = document.getElementById('mesa-edit-numero').value;
    const status = document.getElementById('mesa-edit-status').value;

    const payload = {
        id: parseInt(id),
        numero: parseInt(numero),
        status: status
    };

    try {
        const response = await fetch(`${API_ADMIN_URL}/mesas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Falha ao atualizar mesa.");

        alert(`Mesa ${numero} atualizada!`);
        window.location.reload();
    } catch (error) {
        alert(error.message);
    }
}

async function deletarMesa() {
    const id = document.getElementById('mesa-edit-id').value;
    if(!confirm("Tem certeza que deseja excluir esta mesa?")) return;

    try {
        const response = await fetch(`${API_ADMIN_URL}/mesas/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Não é possível deletar mesa ocupada ou inexistente.");

        alert("Mesa excluída!");
        window.location.reload();
    } catch (error) {
        alert(error.message);
    }
}

// --- LOGICA DE CARDÁPIO ---

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
        const response = await fetch(`${API_ADMIN_URL}/cardapio`, {
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
        const response = await fetch(`${API_ADMIN_URL}/cardapio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, nome, preco, categoria, tipo })
        });
        if (!response.ok) throw new Error("Falha ao editar item.");
        const item = await response.json();
        alert(`Item ${item.nome} (ID: ${item.id}) atualizado!`);
    } catch (error) {
        alert(error.message);
    }
}

// --- LOGICA DE CONFIGURAÇÕES E RELATÓRIOS ---

async function definirCouvert(event) {
    event.preventDefault();
    const couvert = document.getElementById('couvert-novo-valor').value;

    const gorjetaBebida = document.getElementById('gorjeta-bebidas-nova').value || 0;
    const gorjetaComida = document.getElementById('gorjeta-comidas-nova').value || 0;

    try {
        const response = await fetch(`${API_ADMIN_URL}/configuracoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gorjetaBebida, gorjetaComida, valorCouvertPessoa: couvert })
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
        const response = await fetch(`${API_ADMIN_URL}/configuracoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gorjetaBebida, gorjetaComida, valorCouvertPessoa: couvert })
        });
        if (!response.ok) throw new Error("Falha ao salvar gorjetas.");
        const config = await response.json();
        document.getElementById('gorjeta-bebidas-atual').innerText = (config.percentualGorjetaBebida).toFixed(0);
        document.getElementById('gorjeta-comidas-atual').innerText = (config.percentualGorjetaComida).toFixed(0);
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
        const response = await fetch(`${API_ADMIN_URL}/relatorio/faturamento?inicio=${inicio}&fim=${fim}`, {
            method: 'GET',
        });
        if (!response.ok) throw new Error("Falha ao gerar relatório.");

        const faturamento = await response.json();

        document.getElementById('rel-faturamento').innerText = faturamento.toFixed(2);

        mostrarSubPainel('relatorio-resultado', true);
    } catch (error) {
        alert(error.message);
    }
}