function setupPanelSwitcher(dropdownId, panelClass, panelIdPrefix = 'painel-') {
    
    const seletorAcao = document.getElementById(dropdownId);

    if (!seletorAcao) {
        return;
    }

    seletorAcao.addEventListener('change', function() {
        const valorSelecionado = this.value;

        document.querySelectorAll('.' + panelClass).forEach(painel => {
            painel.style.display = 'none';
        });

        if (valorSelecionado !== "0") {
            const painelParaMostrar = document.getElementById(panelIdPrefix + valorSelecionado);
            if (painelParaMostrar) {
                painelParaMostrar.style.display = 'flex';
            }
        }
    });
}