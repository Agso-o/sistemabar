document.addEventListener('DOMContentLoaded', () => {
    // Tenta configurar o switcher para a página de ADMIN
    // (Procura pelo select com id 'acao_admin')
    setupPanelSwitcher('acao_admin', 'painel-acao');

    // Tenta configurar o switcher para a página de GARÇOM
    // (Procura pelo select com id 'acao_garcom')
    setupPanelSwitcher('acao_garcom', 'painel-acao');
});

/**
 * Função genérica para trocar painéis baseado em um dropdown.
 */
function setupPanelSwitcher(dropdownId, panelClass, panelIdPrefix = 'painel-') {

    const seletorAcao = document.getElementById(dropdownId);

    // Se o dropdown não existir na página atual, a função para por aqui.
    // Isso evita erros no console (ex: tentando achar 'acao_admin' na página do garçom).
    if (!seletorAcao) {
        return;
    }

    // Função interna para esconder todos os painéis dessa classe
    const esconderTodos = () => {
        document.querySelectorAll('.' + panelClass).forEach(painel => {
            painel.style.display = 'none';
        });
    };

    // 1. Estado Inicial: Esconde tudo ao carregar a página
    esconderTodos();

    // 2. Adiciona o evento de troca
    seletorAcao.addEventListener('change', function() {
        const valorSelecionado = this.value;

        // Primeiro esconde o painel anterior
        esconderTodos();

        // Se não for a opção padrão "Selecione...", mostra o novo painel
        if (valorSelecionado !== "0") {
            const painelParaMostrar = document.getElementById(panelIdPrefix + valorSelecionado);
            if (painelParaMostrar) {
                // Usamos 'block' pois é o padrão para divs.
                // Se o seu CSS usar flexbox dentro do painel, ele já vai funcionar.
                painelParaMostrar.style.display = 'block';

                // Reset visual para o painel de relatórios (caso específico do Admin)
                if (valorSelecionado === "5" && dropdownId === 'acao_admin') {
                    const resultado = document.getElementById('relatorio-resultado');
                    if(resultado) resultado.style.display = 'none';
                }
            }
        }
    });
}