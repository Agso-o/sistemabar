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

        if (!response.ok) throw new Error(await response.text());
        alert(`Mesa ${numeroMesa} aberta!`);
    } catch (error) { alert("Erro: " + error.message); }
}

// --- ADICIONAR PESSOA ---
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
        const comanda = await response.json();
        alert(`Mesa ${mesa} agora tem ${comanda.pessoas} pessoas.`);
        document.getElementById('add-pessoa-qtd').value = "";
    } catch (error) { alert("Erro: " + error.message); }
}

// --- ADICIONAR ITEM ---
async function adicionarItem(event) {
    event.preventDefault();
    const mesa = document.getElementById('add-item-mesa').value;
    const item = document.getElementById('add-item-codigo').value;
    const qtd = document.getElementById('add-item-qtd').value;

    try {
        const response = await fetch(`${API_GARCOM_URL}/add-pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroMesa: parseInt(mesa), numeroItem: parseInt(item), quantidade: parseInt(qtd) })
        });
        if (!response.ok) throw new Error(await response.text());
        alert(`Item adicionado!`);
        document.getElementById('add-item-codigo').value = "";
        document.getElementById('add-item-qtd').value = "";
    } catch (error) { alert("Erro: " + error.message); }
}

// --- COUVERT ---
async function alternarCouvert(cobrar) {
    const mesa = document.getElementById('couvert-mesa-numero').value;
    if(!mesa) { alert("Digite o número da mesa."); return; }

    try {
        const response = await fetch(`${API_GARCOM_URL}/couvert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeroMesa: parseInt(mesa), cobrar: cobrar })
        });

        if (!response.ok) throw new Error(await response.text());

        const comanda = await response.json();
        const msg = cobrar ? "APLICADO" : "REMOVIDO";

        // Se o valor for 0, avisa que talvez falte configurar no admin
        if(cobrar && comanda.valorCouvertAplicado === 0) {
            alert(`Couvert ativado, mas o valor está R$ 0,00.\nConfigure o preço no Painel Admin.`);
        } else {
            alert(`Couvert ${msg}!\nNovo Valor Total de Couvert: R$ ${comanda.valorCouvertAplicado.toFixed(2)}`);
        }

    } catch (error) { alert("Erro: " + error.message); }
}

// --- PAGAMENTO ---
async function verificarSaldo(event) {
    event.preventDefault();
    const mesa = document.getElementById('pgto-mesa-numero').value;
    if (!mesa) { alert("Digite a mesa."); return; }
    document.getElementById('pgto-area-pagar').style.display = 'none';
    try {
        await buscarDadosSaldo(mesa);
        document.getElementById('form-consulta-pgto').style.display = 'none';
        document.getElementById('pgto-area-pagar').style.display = 'flex';
    } catch (error) { alert("Erro: " + error.message); }
}

async function atualizarValoresPgto() {
    const mesa = document.getElementById('pgto-mesa-numero').value;
    if (!mesa) return;
    try { await buscarDadosSaldo(mesa); } catch (error) { alert("Erro: " + error.message); }
}

async function buscarDadosSaldo(mesa) {
    const timestamp = new Date().getTime();
    const response = await fetch(`${API_GARCOM_URL}/saldo?mesa=${mesa}&_=${timestamp}`, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache', 'Expires': '0' }
    });
    if (!response.ok) throw new Error(await response.text());
    const info = await response.json();
    atualizarPainelPagamento(info);
}

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

        if(info.saldoRestante <= 0.01) alert("Conta quitada! Pode fechar a mesa.");
    } catch (error) { alert("Erro: " + error.message); }
}

// --- DESENHAR PAINEL DETALHADO ---
function atualizarPainelPagamento(info) {
    // Monta um resumo em HTML para ficar claro
    const htmlDetalhes = `
        <div style="font-size: 14px; text-align: left; margin-bottom: 10px; color: #ccc;">
            <p>Consumo Itens: <span style="float: right;">R$ ${info.subtotalItens.toFixed(2)}</span></p>
            <p>+ Gorjeta (Serviço): <span style="float: right;">R$ ${info.valorGorjeta.toFixed(2)}</span></p>
            <p style="color: #ffdd59;">+ Couvert (Entrada): <span style="float: right;">R$ ${info.valorCouvert.toFixed(2)}</span></p>
            <hr style="border-color: #555;">
            <p style="font-weight: bold; color: white;">= TOTAL CONTA: <span style="float: right;">R$ ${info.totalConta.toFixed(2)}</span></p>
            <p style="color: #4cd137;">- Total Já Pago: <span style="float: right;">R$ ${info.totalJaPago.toFixed(2)}</span></p>
        </div>
    `;

    // Insere o resumo antes do Total Restante
    // (Vamos usar o elemento pgto-view-total apenas como container ou substituir o texto)
    document.getElementById('pgto-view-total').innerHTML = htmlDetalhes; // Substitui o texto simples

    // Atualiza o Saldo Restante Grande
    document.getElementById('pgto-view-restante').innerText = `R$ ${info.saldoRestante.toFixed(2)}`;
    // Limpa o campo 'Já Pago' antigo pois agora está no detalhe
    document.getElementById('pgto-view-pago').innerText = "";

    // Lista de parciais (Histórico)
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
    // Limpa a view para não piscar dados antigos na proxima vez
    document.getElementById('pgto-view-total').innerHTML = "R$ 0,00";
}

// --- FECHAR/CANCELAR ---
async function fecharConta(e) { /* Igual ao anterior */
    e.preventDefault();
    const mesa = document.getElementById('fechar-mesa-numero').value;
    try {
        const response = await fetch(`${API_GARCOM_URL}/fechar`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({numeroMesa: parseInt(mesa)}) });
        if(!response.ok) throw new Error(await response.text());
        alert("Mesa fechada!");
        document.getElementById('pgto-area-pagar').style.display = 'none';
        document.getElementById('form-consulta-pgto').style.display = 'flex';
    } catch(err) { alert("Erro: " + err.message); }
}

async function removerItem(e) { /* Igual ao anterior */
    e.preventDefault();
    const id = document.getElementById('remover-item-codigo').value;
    const mot = document.getElementById('remover-item-motivo').value;
    try {
        const response = await fetch(`${API_GARCOM_URL}/cancelar-pedido`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({pedidoId: parseInt(id), motivo: mot}) });
        if(!response.ok) throw new Error(await response.text());
        alert("Cancelado!");
    } catch(err) { alert("Erro: " + err.message); }
}