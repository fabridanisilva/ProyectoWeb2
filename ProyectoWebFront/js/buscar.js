document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Como siempre validamos la secion
    const miId = localStorage.getItem("usuarioId");
    const miUsername = localStorage.getItem("username");

    if (!miId) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("nombreUsuario").textContent = "Hola, @" + miUsername;

    // 2. logica de busqueda de usuarios
    const formBuscar = document.getElementById("formBuscar");
    const inputBusqueda = document.getElementById("inputBusqueda");
    const contenedorResultados = document.getElementById("contenedorResultados");

    formBuscar.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = inputBusqueda.value.trim();

        try {
            // Le pegamos al buscador de Spring Boot
            const respuesta = await fetch(`http://localhost:8080/api/usuarios/buscar?query=${query}`);
            
            if (respuesta.ok) {
                const usuarios = await respuesta.json();
                mostrarResultados(usuarios);
            }
        } catch (error) {
            console.error("Error al buscar:", error);
            contenedorResultados.innerHTML = `<div class="alert alert-danger">Error de conexión con el servidor.</div>`;
        }
    });

    // 3. mostramos lo resultados en la pantalla
    function mostrarResultados(usuarios) {
        contenedorResultados.innerHTML = ""; // Limpiamos búsquedas anteriores

        if (usuarios.length === 0) {
            contenedorResultados.innerHTML = `<div class="alert alert-info">No se encontraron usuarios con ese nombre.</div>`;
            return;
        }

        usuarios.forEach(usuario => {
            // Evitamos mostrarnos a nosotros mismos en la lista de búsqueda
            if (usuario.idUsuario == miId) return;

            const card = document.createElement("div");
            card.className = "card mb-3 shadow-sm";
            card.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        
                        <h5 class="card-title mb-0 fw-bold">
                            <a href="perfil.html?id=${usuario.idUsuario}" class="text-dark text-decoration-none">@${usuario.username}</a>
                        </h5>
                        <p class="text-muted mb-0">${usuario.nombre} ${usuario.apellido}</p>
                    </div>
                    <button class="btn btn-outline-primary btn-sm btn-seguir" data-id="${usuario.idUsuario}">
                        Seguir
                    </button>
                </div>
            `;
            contenedorResultados.appendChild(card);
        });

        // 4. activar  "SEGUIR"
        const botonesSeguir = document.querySelectorAll(".btn-seguir");
        botonesSeguir.forEach(boton => {
            boton.addEventListener("click", async (e) => {
                const idASeguir = e.target.getAttribute("data-id");
                seguirUsuario(idASeguir, e.target);
            });
        });
    }

    // 5. seguir a usuario
    async function seguirUsuario(idASeguir, botonHTML) {
        try {
            const respuesta = await fetch(`http://localhost:8080/api/usuarios/${miId}/seguir/${idASeguir}`, {
                method: "POST"
            });

            if (respuesta.ok) {
                // Cambiamos el botón
                botonHTML.textContent = "Siguiendo";
                botonHTML.classList.replace("btn-primary", "btn-success");
                botonHTML.disabled = true;

                // MAGIA: Sumamos +1 al contador en la pantalla al instante
                const contadorHTML = document.getElementById("countSeguidores");
                let numeroActual = parseInt(contadorHTML.textContent);
                contadorHTML.textContent = numeroActual + 1;
                
            } else {
                alert("Ya sigues a este usuario o hubo un error.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
});