document.addEventListener("DOMContentLoaded", () => {

    const formLogin = document.getElementById("formLogin");

    // aca iniciamos secion
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const credenciales = {
            username: document.getElementById("loginUsername").value,
            password: document.getElementById("loginPassword").value
        };

        try {
            const respuesta = await fetch("http://localhost:8080/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credenciales)
            });

            if (respuesta.ok) {
                const usuarioLogueado = await respuesta.json();
                
                // Guardamos la sesión
                localStorage.setItem("usuarioId", usuarioLogueado.idUsuario);
                localStorage.setItem("username", usuarioLogueado.username);
                
                // Lo mandamos al feed
                window.location.href = "feed.html";
            } else {
                const errorText = await respuesta.text();
                mostrarError("Error al iniciar sesión: " + errorText);
            }
        } catch (error) {
            mostrarError("Error de conexión con el servidor.");
            console.error(error);
        }
    });


    // Aca vamos a registrarnos
    const formRegistro = document.getElementById("formRegistro");
    const alertaError = document.getElementById("alertaError");

    formRegistro.addEventListener("submit", async (e) => {
        e.preventDefault(); // evita que la página recargue al tocar el botón

        // 1 Armamos el objeto con los datos del form
        const nuevoUsuario = {
            username: document.getElementById("username").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            email: document.getElementById("email").value,
            edad: document.getElementById("edad").value,
            password: document.getElementById("password").value
        };

        try {
            // 2 Hacemos la petición a Spring Boot
            const respuesta = await fetch("http://localhost:8080/api/usuarios/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoUsuario)
            });

            // 3 Evaluamos la respuesta
            if (respuesta.ok) {
                const usuarioCreado = await respuesta.json();
                
                // guardamos el ID del usuario en el navegador
                localStorage.setItem("usuarioId", usuarioCreado.idUsuario);
                localStorage.setItem("username", usuarioCreado.username);
                
                // Lo mandamos al inicio de la red social
                window.location.href = "feed.html";
            } else {
                // Si tira error (ej: email ya existe), lo mostramos en rojo
                const mensajeError = await respuesta.text();
                mostrarError(mensajeError);
            }
        } catch (error) {
            mostrarError("Error de conexión con el servidor. Revisá que Spring Boot esté encendido.");
            console.error(error);
        }
    });

    function mostrarError(mensaje) {
        alertaError.textContent = mensaje;
        alertaError.classList.remove("d-none");
    }
});