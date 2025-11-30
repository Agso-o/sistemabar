function protegerPagina(perfilNecessario) {
    const token = localStorage.getItem('token');
    const perfilUsuario = localStorage.getItem('perfil');

    if (!token) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "/login";
        return;
    }

    if (perfilNecessario && perfilNecessario !== perfilUsuario) {
        if (perfilUsuario === 'ADMIN') return;

        alert("Acesso Negado!");
        window.location.href = "/";
    }
}