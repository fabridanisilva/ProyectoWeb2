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

            // Rescatamos el ID de la imagen para poder valorarla
            const idImagen = (pub.imagenes && pub.imagenes.length > 0) ? pub.imagenes[0].id : null;

            const usernameAutor = pub.autor ? pub.autor.username : "usuario_anonimo";
            const nombreAutor = pub.autor ? `${pub.autor.nombre} ${pub.autor.apellido}` : "";


            // ARMAMOS LA TARJETA CON LA IMAGEN
            const card = document.createElement("div");
            // Si estás en perfil.js, la clase de la card era "col-md-6 mb-4" en vez de "card mb-4 shadow-sm"
            card.className = "card mb-4 shadow-sm"; 
            card.innerHTML = `
                <div class="card-header bg-white d-flex align-items-center border-bottom-0 pt-3 pb-2">
                    <div>
                        <span class="fw-bold text-dark" style="cursor: pointer;">@${usernameAutor}</span>
                        <span class="text-muted small ms-2">${nombreAutor}</span>
                    </div>
                </div>

                <img src="${urlFoto}" class="card-img-top" alt="Publicación" style="max-height: 500px; object-fit: cover;">
                
                <div class="card-body pt-2">
                    <h5 class="card-title fw-bold">${pub.titulo}</h5>
                    <p class="card-text">${pub.descripcion}</p>
                    ${idImagen ? `
                        <hr>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="estrellas-container" data-id-imagen="${idImagen}">
                                <span class="estrella fs-4 text-muted" style="cursor: pointer;" data-valor="1">★</span>
                                <span class="estrella fs-4 text-muted" style="cursor: pointer;" data-valor="2">★</span>
                                <span class="estrella fs-4 text-muted" style="cursor: pointer;" data-valor="3">★</span>
                                <span class="estrella fs-4 text-muted" style="cursor: pointer;" data-valor="4">★</span>
                                <span class="estrella fs-4 text-muted" style="cursor: pointer;" data-valor="5">★</span>
                            </div>
                            <div class="text-muted small">
                                <span id="promedio-${idImagen}" class="fw-bold text-warning">0.0</span> 
                                (<span id="cantidad-${idImagen}">0</span> votos)
                            </div>
                        </div>
                        <hr>
                    <div class="comentarios-section mt-2">
                        <h6 class="fw-bold mb-2">Comentarios</h6>
                        
                        <div id="lista-comentarios-${pub.idPublicacion}" class="mb-3" style="max-height: 150px; overflow-y: auto; font-size: 0.9rem;">
                            <div class="text-center text-muted small">Cargando comentarios...</div>
                        </div>
                        
                        ${pub.comentariosCerrados ? 
                            `<div class="alert alert-secondary small py-1 text-center mb-0">Los comentarios están cerrados.</div>` 
                            : 
                            `<div class="input-group input-group-sm">
                                <input type="text" id="input-comentario-${pub.idPublicacion}" class="form-control form-control-sm" placeholder="Escribe un comentario...">
                                <button class="btn btn-outline-primary btn-comentar" data-id-pub="${pub.idPublicacion}">Enviar</button>
                            </div>`
                        }
                    </div>
                    ` : ''}
                </div>
            `;
            contenedor.appendChild(card);

            // Si la publicación tiene una imagen, le pedimos al backend sus estadísticas
            if (idImagen) {
                cargarEstadisticas(idImagen);
                cargarComentarios(pub.idPublicacion);
            }
        });
    }

    
    // esta va a ser la logica de las valoraciones (ESTRELLAS)
    
    // 1. Ir a buscar el promedio al backend
    async function cargarEstadisticas(idImagen) {
        try {
            const respuesta = await fetch(`http://localhost:8080/api/valoraciones/estadisticas/${idImagen}`);
            if (respuesta.ok) {
                const stats = await respuesta.json();
                document.getElementById(`promedio-${idImagen}`).textContent = stats.promedio.toFixed(1);
                document.getElementById(`cantidad-${idImagen}`).textContent = stats.cantidad;
            }
        } catch (error) {
            console.error("Error al cargar estadísticas", error);
        }
    }


    // 2. damos vida a los clics de las estrellas
    
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("estrella")) {
            const puntaje = e.target.getAttribute("data-valor");
            const contenedorEstrellas = e.target.closest(".estrellas-container");
            const idImagen = contenedorEstrellas.getAttribute("data-id-imagen");
            
            try {
                const valoracionDTO = {
                    idImagen: parseInt(idImagen),
                    idUsuario: parseInt(idUsuario), 
                    puntaje: parseInt(puntaje)
                };
                // Hacemos el POST a tu controlador nuevo
                const respuesta = await fetch(`http://localhost:8080/api/valoraciones`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(valoracionDTO)
                });

                if (respuesta.ok) {
                    //esto es animación visual cortita: pintamos las estrellas de amarillo asi queda joya
                    const estrellas = contenedorEstrellas.querySelectorAll(".estrella");
                    estrellas.forEach((star, index) => {
                        if (index < puntaje) {
                            star.classList.replace("text-muted", "text-warning");
                        } else {
                            star.classList.replace("text-warning", "text-muted");
                        }
                    });

                    // Recargamos el promedio para que se actualice el número en vivo
                    cargarEstadisticas(idImagen);
                    
                } else {
                    const errorText = await respuesta.text();
                    alert("No se pudo valorar: " + errorText);
                }
            } catch (error) {
                console.error("Error al enviar valoración", error);
            }
        }


        //enviar comentario
        if (e.target.classList.contains("btn-comentar")) {
            const idPublicacion = e.target.getAttribute("data-id-pub");
            const inputElement = document.getElementById(`input-comentario-${idPublicacion}`);
            const texto = inputElement.value.trim();
            const idUsuarioLogueado = localStorage.getItem("usuarioId");

            if (!idUsuarioLogueado) {
                alert("Debes iniciar sesión para comentar.");
                return;
            }

            if (!texto) return; // No hacemos nada si el input está vacío

            try {
                // Armamos el DTO como lo espera el Backend
                const comentarioDTO = {
                    idUsuario: parseInt(idUsuarioLogueado),
                    idPublicacion: parseInt(idPublicacion),
                    texto: texto
                };

                // Hacemos el POST (cambiá el puerto/url si es distinto)
                const respuesta = await fetch(`http://localhost:8080/api/comentarios`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(comentarioDTO)
                });

                if (respuesta.ok) {
                    // Limpiamos el input
                    inputElement.value = "";
                    // Recargamos la lista de comentarios para que aparezca el nuevo al instante
                    cargarComentarios(idPublicacion);
                } else {
                    const errorText = await respuesta.text();
                    alert("No se pudo enviar el comentario: " + errorText);
                }
            } catch (error) {
                console.error("Error al enviar comentario:", error);
            }
        }
    });


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




// aca vamos a hacer que los comentarios funcionen


    async function cargarComentarios(idPublicacion) {
        const contenedor = document.getElementById(`lista-comentarios-${idPublicacion}`);
        if (!contenedor) return;

        try {
            const respuesta = await fetch(`http://localhost:8080/api/comentarios/publicacion/${idPublicacion}`);
            if (respuesta.ok) {
                const comentarios = await respuesta.json();
                
                if (comentarios.length === 0) {
                    contenedor.innerHTML = `<div class="text-muted small text-center">Sé el primero en comentar.</div>`;
                    return;
                }

                // Armamos la lista de comentarios
                contenedor.innerHTML = comentarios.map(com => `
                    <div class="mb-1">
                        <span class="fw-bold text-dark me-1">@${com.usuario.username}</span>
                        <span class="text-secondary">${com.texto}</span>
                    </div>
                `).join("");
                
                // Hacemos scroll automático hacia el último comentario
                contenedor.scrollTop = contenedor.scrollHeight;
            } else {
                contenedor.innerHTML = `<div class="text-danger small text-center">Error al cargar.</div>`;
            }
        } catch (error) {
            console.error("Error cargando comentarios:", error);
            contenedor.innerHTML = `<div class="text-danger small text-center">Error de conexión.</div>`;
        }
    }