document.addEventListener("DOMContentLoaded", () => {
    
    // 1. RECUPERAMOS LA SESIÓN
    const idUsuario = localStorage.getItem("usuarioId");
    const username = localStorage.getItem("username");

    // Si alguien intenta entrar a feed.html sin registrarse/loguearse, lo pateamos
    if (!idUsuario) {
        window.location.href = "index.html";
        return;
    }

    // 2. MOSTRAMOS EL NOMBRE EN LA BARRA
    document.getElementById("nombreUsuario").textContent = "Hola, @" + username;

    // 3. BOTÓN DE CERRAR SESIÓN
    document.getElementById("btnCerrarSesion").addEventListener("click", () => {
        localStorage.clear(); // Borramos los datos
        window.location.href = "index.html"; // Lo mandamos al inicio
    });

    // 4. CARGAR LAS PUBLICACIONES DEL USUARIO
    cargarMisPublicaciones();

    async function cargarMisPublicaciones() {
        try {
            // Le pegamos al endpoint que armaste en PublicacionControlador
            const respuesta = await fetch(`http://localhost:8080/api/publicaciones/feed/${idUsuario}`);
            
            if (respuesta.ok) {
                const publicaciones = await respuesta.json();
                mostrarPublicaciones(publicaciones);
            }
        } catch (error) {
            console.error("Error al cargar publicaciones:", error);
        }
    }

    function mostrarPublicaciones(publicaciones) {
        const contenedor = document.getElementById("contenedorPublicaciones");
        contenedor.innerHTML = ""; // Limpiamos "Cargando..."

        if (publicaciones.length === 0) {
            contenedor.innerHTML = `
                <div class="alert alert-info text-center">
                    Aún no tenés ninguna publicación. ¡Es hora de subir la primera!
                </div>`;
            return;
        }

        // Si hay publicaciones, las dibujamos (por ahora solo dibujamos el texto)
        publicaciones.forEach(pub => {
            const card = document.createElement("div");
            card.className = "card mb-4 shadow-sm";
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title fw-bold">${pub.titulo}</h5>
                    <p class="card-text">${pub.descripcion}</p>
                    <small class="text-muted">ID Publicación: ${pub.idPublicacion}</small>
                </div>
            `;
            contenedor.appendChild(card);
        });
    }

    
    const formPublicacion = document.getElementById("formPublicacion");

    formPublicacion.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 1. Agarramos el texto de las etiquetas y lo convertimos en un array real
        const etiquetasString = document.getElementById("pubEtiquetas").value;
        const etiquetasArray = etiquetasString.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

        // 2. Armamos el DTO exactamente como lo espera Spring Boot
        const nuevaPublicacionDTO = {
            idAutor: idUsuario,
            titulo: document.getElementById("pubTitulo").value,
            descripcion: document.getElementById("pubDescripcion").value,
            urlsImagenes: [document.getElementById("pubImagen").value], // Lo mandamos como array
            etiquetas: etiquetasArray
        };

        try {
            // 3. Hacemos el POST al backend
            const respuesta = await fetch("http://localhost:8080/api/publicaciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevaPublicacionDTO)
            });

            if (respuesta.ok) {
                // Si todo salió bien:
                alert("¡Publicación creada con éxito!");
                
                // Aca erramos el modal usando JS de Bootstrap
                const modalElement = document.getElementById('modalPublicacion');
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
                
                // Limpiamos el formulario
                formPublicacion.reset();
                
                // Como publicamos algo nuevo, recargamos el Feed para que aparezca (en teoria)
                
            } else {
                const errorText = await respuesta.text();
                alert("Error al publicar: " + errorText);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error al conectar con el servidor.");
        }
    });
});