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
            // este endpoint nos va a devolver las publicaciones de las personas que seguimos
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
        contenedor.innerHTML = ""; 

        if (publicaciones.length === 0) {
            contenedor.innerHTML = `
                <div class="alert alert-info text-center">
                    Aún no hay publicaciones para mostrar.
                </div>`;
            return;
        }

        publicaciones.forEach(pub => {
            
            // Revisamos si Spring Boot nos mandó la lista de entidades "imagenes"
            let urlFoto = "https://via.placeholder.com/600x400?text=Foto+no+disponible"; 
            
            if (pub.imagenes && pub.imagenes.length > 0) {
                // Entra acá si devuelve la entidad Imagen (lo normal en Spring Boot)
                urlFoto = pub.imagenes[0].urlArchivo; 
            } else if (pub.urlsImagenes && pub.urlsImagenes.length > 0) {
                // Entra acá por las dudas si armaste un DTO de respuesta
                urlFoto = pub.urlsImagenes[0];
            }

            // ARMAMOS LA TARJETA CON LA IMAGEN
            const card = document.createElement("div");
            // Si estás en perfil.js, la clase de la card era "col-md-6 mb-4" en vez de "card mb-4 shadow-sm"
            card.className = "card mb-4 shadow-sm"; 
            card.innerHTML = `
                <img src="${urlFoto}" class="card-img-top" alt="Publicación" style="max-height: 500px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${pub.titulo}</h5>
                    <p class="card-text">${pub.descripcion}</p>
                </div>
            `;
            contenedor.appendChild(card);
        });
    }

    //subir foto
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