document.addEventListener('DOMContentLoaded', () => {
    verificarUsuario();
});

function verificarUsuario() {
    const perfil = localStorage.getItem('perfil');
    const token = localStorage.getItem('token');

    const painelPublico = document.getElementById('painel-publico');
    const painelAdmin = document.getElementById('painel-admin');
    const painelGarcom = document.getElementById('painel-garcom');

    const btnLogin = document.getElementById('btn-login');
    const btnSair = document.getElementById('btn-sair');
    const btnQr = document.getElementById('btn-qrcode');

    // Se NÃO tem token, mostra a tela de login
    if (!token) {
        painelPublico.style.display = 'flex';
        painelAdmin.style.display = 'none';
        painelGarcom.style.display = 'none';

        btnLogin.style.display = 'block';
        btnSair.style.display = 'none';
        if(btnQr) btnQr.style.display = 'none';
        return;
    }

    // Se TEM token, esconde o público
    painelPublico.style.display = 'none';
    btnLogin.style.display = 'none';
    btnSair.style.display = 'block';

    // Mostra o painel correto
    if (perfil === 'ADMIN') {
        painelAdmin.style.display = 'flex';
        painelGarcom.style.display = 'none';
        if (btnQr) btnQr.style.display = 'block';

    } else if (perfil === 'GARCOM') {
        painelGarcom.style.display = 'flex';
        painelAdmin.style.display = 'none';
        if (btnQr) btnQr.style.display = 'block';
    }
}

function fazerLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    window.location.reload();
}