function cargarMenuNavegacion() {
    const contenedorMenu = document.getElementById('nav-user-menu');
    
    // Si la página no tiene el nav (por ejemplo, la pantalla de login), no hacemos nada
    if (!contenedorMenu) return; 

    // 1. Nos fijamos si hay alguien en la memoria
    const usuarioString = localStorage.getItem('usuarioActual');

    if (usuarioString) {
        // 2A. SI HAY USUARIO: Mostramos su nombre y el botón de salir
        const usuario = JSON.parse(usuarioString);
        contenedorMenu.innerHTML = `
            <span class="text-light me-3">Hola, <b>${usuario.nombre}</b></span>
            <a href="carrito.html" class="btn btn-outline-light btn-sm">Carrito 🛒</a>
            <button onclick="cerrarSesion()" class="btn btn-danger btn-sm">Salir</button>
        `;
    } else {
        // 2B. SI NO HAY USUARIO: Mostramos los botones de login y registro
        contenedorMenu.innerHTML = `
            <a href="carrito.html" class="btn btn-outline-light btn-sm">Carrito 🛒</a>
            <a href="login.html" class="btn btn-light btn-sm">Iniciar Sesión</a>
            <a href="registro.html" class="btn btn-primary btn-sm">Registrarse</a>
        `;
    }
}

// Función para desloguearse
function cerrarSesion() {
    // Borramos al usuario de la memoria
    localStorage.removeItem('usuarioActual');
    
    // (Opcional) Podrías vaciar el carrito también cuando cierra sesión
    // localStorage.removeItem('carritoPerfumes'); 
    
    // Recargamos la página para que el menú se actualice
    window.location.reload(); 
}

// Ejecutamos la función apenas el script carga
cargarMenuNavegacion();