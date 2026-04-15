const API_USUARIOS = "http://localhost:8080/api/usuarios";

async function registrar() {
    const usuarioNuevo = {
        nombre: document.getElementById('reg-nombre').value,
        apellido: document.getElementById('reg-apellido').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value
    };

    try {
        const respuesta = await fetch(`${API_USUARIOS}/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioNuevo)
        });

        if (respuesta.ok) {
            alert("¡Cuenta creada con éxito! Ahora podés iniciar sesión.");
            window.location.href = "login.html"; // Lo mandamos al login
        } else {
            alert("Hubo un error al registrar el usuario.");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor.");
    }
}

async function iniciarSesion() {
    const credenciales = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const respuesta = await fetch(`${API_USUARIOS}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credenciales)
        });

        if (respuesta.ok) {
            // El backend nos devuelve el objeto Usuario completo
            const usuarioLogueado = await respuesta.json();
            
            // LA MAGIA: Guardamos al usuario en el localStorage
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioLogueado));
            
            alert(`¡Hola ${usuarioLogueado.nombre}! Sesión iniciada.`);
            window.location.href = "index.html"; // Lo mandamos a la tienda
        } else {
            alert("Email o contraseña incorrectos ❌");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor.");
    }
}