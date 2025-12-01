protegerPagina('ADMIN');

setupPanelSwitcher('acao_admin', 'painel-acao', 'painel-');

const API_ADMIN_URL = "http://localhost:8080/api/admin";

function mostrarSubPainel(painelId, mostrar) {
    const painel = document.getElementById(painelId);
    if (painel) {
        painel.style.display = mostrar ? 'flex' : 'none';
    }
}

// --- LOGICA DE MESAS (Busca por Numero + Status Fechada/Aberta) ---

async function verificarMesa(event) {
    event.preventDefault();
    const numeroMesa = document.getElementById('mesa-numero').value;

    if(!numeroMesa) { alert("Digite o número da mesa"); return; }

    mostrarSubPainel('mesa-edit-panel', false);
    mostrarSubPainel('mesa-create-panel', false);

    try {
        const response = await fetch(`${API_ADMIN_URL}/mesas/buscar?numero=${numeroMesa}`);

        if (response.status === 404) {
            // Mesa NÃO existe -> Painel Criar
            mostrarSubPainel('mesa-create-panel', true);
        } else if (response.ok) {
            // Mesa EXISTE -> Painel Editar
            const mesa = await response.json();

            document.getElementById('mesa-edit-id').value = mesa.id;
            document.getElementById('mesa-edit-numero').value = mesa.numero;
            document.getElementById('mesa-edit-status').value = mesa.status;

            mostrarSubPainel('mesa-edit-panel', true);
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
        if (!response.ok) throw new Error("Falha ao criar mesa (Número duplicado?).");

        alert(`Mesa ${numeroMesa} criada com sucesso!`);
        window.location.reload();
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
        if (!response.ok) throw new Error("Não é possível deletar mesa ABERTA.");

        alert("Mesa excluída!");
        window.location.reload();
    } catch (error) {
        alert(error.message);
    }
}

// --- LOGICA DE CARDÁPIO (Usa Número Visual + Soft Delete) ---

async function verificarItem(event) {
    event.preventDefault();
    const numero = document.getElementById('item-codigo').value;
    if (!numero) {
        alert("Digite o Código/Número do item.");
        return;
    }

    mostrarSubPainel('item-create-panel', false);
    mostrarSubPainel('item-edit-panel', false);

    try {
        // Busca pelo NÚMERO
        const response = await fetch(`${API_ADMIN_URL}/cardapio/buscar?numero=${numero}`);

        if (response.status === 404) {
            // Não achou -> Sugere criar
            mostrarSubPainel('item-create-panel', true);
            document.getElementById('item-create-numero').value = numero;
        } else if (response.ok) {
            // Achou -> Painel Editar
            const item = await response.json();

            document.getElementById('item-edit-id').value = item.id;
            document.getElementById('item-edit-numero').value = item.numero;
            document.getElementById('item-edit-nome').value = item.nome;
            document.getElementById('item-edit-preco').value = item.preco;
            document.getElementById('item-edit-tipo-select').value = item.tipo;

            const statusTexto = item.ativo ? "ATIVO" : "INATIVO (Excluído)";
            document.getElementById('item-status-label').innerText = statusTexto;

            mostrarSubPainel('item-edit-panel', true);
        }
    } catch (error) {
        alert("Erro ao verificar item.");
    }
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
        if (!response.ok) {
             const msg = await response.text();
             throw new Error(msg);
        }
        alert(`Item ${nome} criado!`);
        window.location.reload();
    } catch (error) {
        alert("Erro: " + error.message);
    }
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
                ativo: true // Editar sempre reativa (se estiver inativo)
            })
        });
        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }
        alert(`Item atualizado!`);
        window.location.reload();
    } catch (error) {
        alert("Erro: " + error.message);
    }
}

async function deletarItem() {
    const id = document.getElementById('item-edit-id').value;
    if(!confirm("Tem certeza? O item ficará INATIVO, mas não será apagado do banco.")) return;

    try {
        const response = await fetch(`${API_ADMIN_URL}/cardapio/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Erro ao inativar item.");

        alert("Item Inativado com sucesso!");
        window.location.reload();
    } catch (error) {
        alert(error.message);
    }
}

// --- LOGICA DE CONFIG E RELATÓRIOS ---

async function definirCouvert(event) {
    event.preventDefault();
    const couvert = document.getElementById('couvert-novo-valor').value;

    try {
        const response = await fetch(`${API_ADMIN_URL}/configuracoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gorjetaBebida: 0, gorjetaComida: 0, valorCouvertPessoa: couvert })
        });
        if (!response.ok) throw new Error("Erro.");
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
        if (!response.ok) throw new Error("Erro.");
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
        if (!response.ok) throw new Error("Erro.");

        const faturamento = await response.json();

        document.getElementById('rel-faturamento').innerText = faturamento.toFixed(2);

        mostrarSubPainel('relatorio-resultado', true);
    } catch (error) {
        alert(error.message);
    }
}