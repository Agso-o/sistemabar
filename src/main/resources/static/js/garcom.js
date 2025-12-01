protegerPagina('GARCOM');
setupPanelSwitcher('acao_garcom', 'painel-acao', 'painel-');

const API_GARCOM_URL = "http://localhost:8080/api/garcom";

// --- ABRIR MESA ---
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

// --- NOVO: ADICIONAR PESSOA ---
async function adicionarPessoa(event) {
    event.preventDefault();
    const mesa = document.getElementById('add-pessoa-mesa').value;
    const qtd = document.getElementById('add-pessoa-qtd').value;

    try {
        const response = await fetch(`${API_GARCOM_URL}/add-pessoa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroMesa: parseInt(mesa), quantidade: parseInt(qtd) })
        });

        if (!response.ok) throw new Error(await response.text());

        // Recebemos a comanda atualizada
        const comanda = await response.json();
        alert(`Sucesso! Agora a Mesa ${mesa} tem ${comanda.pessoas} pessoas.`);

        document.getElementById('add-pessoa-qtd').value = ""; // Limpa campo
    } catch (error) {
        alert("Erro: " + error.message);
    }
}

// --- ADICIONAR ITEM ---
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
        document.getElementById('add-item-codigo').value = "";
        document.getElementById('add-item-qtd').value = "";
    } catch (error) {
        alert("Erro: " + error.message);
    }
}

// --- PAGAMENTO: ETAPA 1 (CONSULTAR) ---
async function verificarSaldo(event) {
    event.preventDefault();
    const mesa = document.getElementById('pgto-mesa-numero').value;
    if (!mesa) { alert("Digite a mesa."); return; }

    document.getElementById('pgto-area-pagar').style.display = 'none';

    try {
        await buscarDadosSaldo(mesa);
        document.getElementById('form-consulta-pgto').style.display = 'none';
        document.getElementById('pgto-area-pagar').style.display = 'flex';
    } catch (error) {
        console.error(error);
        alert("Erro ao verificar: " + error.message);
    }
}

async function atualizarValoresPgto() {
    const mesa = document.getElementById('pgto-mesa-numero').value;
    if (!mesa) return;
    try {
        await buscarDadosSaldo(mesa);
    } catch (error) {
        alert("Erro ao atualizar: " + error.message);
    }
}

async function buscarDadosSaldo(mesa) {
    const timestamp = new Date().getTime();
    const response = await fetch(`${API_GARCOM_URL}/saldo?mesa=${mesa}&_=${timestamp}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });

    if (!response.ok) throw new Error(await response.text());

    const info = await response.json();
    atualizarPainelPagamento(info);
}

// --- PAGAMENTO: ETAPA 2 (REALIZAR PAGAMENTO) ---
async function realizarPagamento(event) {
    event.preventDefault();
    const mesa = document.getElementById('pgto-mesa-numero').value;
    const valor = document.getElementById('pgto-valor-input').value;

    if (!valor) { alert("Digite o valor."); return; }

    try {
        const response = await fetch(`${API_GARCOM_URL}/pagar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroMesa: parseInt(mesa), valor: parseFloat(valor) })
        });

        if (!response.ok) throw new Error(await response.text());

        const info = await response.json();
        alert("Pagamento registrado!");

        atualizarPainelPagamento(info);
        document.getElementById('pgto-valor-input').value = "";

        if(info.saldoRestante <= 0.01) {
            alert("Conta quitada! Você pode fechar a mesa agora.");
        }

    } catch (error) { alert("Erro: " + error.message); }
}

// --- DESENHAR PAINEL ---
function atualizarPainelPagamento(info) {
    document.getElementById('pgto-view-total').innerText = `R$ ${info.totalConta.toFixed(2)}`;
    document.getElementById('pgto-view-pago').innerText = `R$ ${info.totalJaPago.toFixed(2)}`;
    document.getElementById('pgto-view-restante').innerText = `R$ ${info.saldoRestante.toFixed(2)}`;

    const lista = document.getElementById('pgto-lista-parciais');
    lista.innerHTML = "";

    if (info.pagamentosParciais && info.pagamentosParciais.length > 0) {
        info.pagamentosParciais.forEach((val, i) => {
            const li = document.createElement('li');
            li.style.borderBottom = "1px solid #444";
            li.style.padding = "5px 0";

            if (val < 0) {
                li.innerHTML = `Movimentação ${i+1}: <span style="float: right; color: #ff6b6b; font-weight: bold;">ESTORNO (R$ ${Math.abs(val).toFixed(2)})</span>`;
            } else {
                li.innerHTML = `Movimentação ${i+1}: <span style="float: right; color: #4cd137;">Pagamento (R$ ${val.toFixed(2)})</span>`;
            }

            lista.appendChild(li);
        });
    } else {
        lista.innerHTML = "<li>Nenhum pagamento ainda.</li>";
    }
}

function cancelarPgto() {
    document.getElementById('pgto-area-pagar').style.display = 'none';
    document.getElementById('form-consulta-pgto').style.display = 'flex';
    document.getElementById('pgto-valor-input').value = "";
}

// --- FECHAR CONTA ---
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
        document.getElementById('pgto-area-pagar').style.display = 'none';
        document.getElementById('form-consulta-pgto').style.display = 'flex';

    } catch (error) {
        alert("Erro: " + error.message);
    }
}

// --- CANCELAR ITEM ---
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