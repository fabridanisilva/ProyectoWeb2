document.addEventListener("DOMContentLoaded", () => {
    
    // 1. SESIÓN Y LECTURA 
    const miId = localStorage.getItem("usuarioId");
    if (!miId) {
        window.location.href = "index.html";
        return;
    }

    // Leemos la URL para ver si estamos visitando a alguien 
    const parametrosUrl = new URLSearchParams(window.location.search);
    let idPerfilVisita = parametrosUrl.get("id");

    // Si no hay ID en la URL, significa que estoy viendo MI propio perfil
    if (!idPerfilVisita) {
        idPerfilVisita = miId;
    }

    // Referencias al HTML
    const perfilUsername = document.getElementById("perfilUsername");
    const perfilNombreCompleto = document.getElementById("perfilNombreCompleto");
    const btnSeguirPerfil = document.getElementById("btnSeguirPerfil");
    const contenedorPublicaciones = document.getElementById("contenedorPerfilPublicaciones");
    

    // 2. cargar datos del usuario
    cargarDatosPerfil();
    cargarPublicaciones();

    async function cargarDatosPerfil() {
        try {
            const respuesta = await fetch(`http://localhost:8080/api/usuarios/id/${idPerfilVisita}`);
            if (respuesta.ok) {
                const usuario = await respuesta.json();
                
                perfilUsername.textContent = `@${usuario.username}`;
                perfilNombreCompleto.textContent = `${usuario.nombre} ${usuario.apellido} • ${usuario.edad} años`;

                const cantSeguidores = usuario.seguidores ? usuario.seguidores.length : 0;
                const cantSeguidos = usuario.seguidos ? usuario.seguidos.length : 0;

                document.getElementById("countSeguidores").textContent = cantSeguidores;
                document.getElementById("countSeguidos").textContent = cantSeguidos;

                if (idPerfilVisita !== miId) {
                    btnSeguirPerfil.classList.remove("d-none");
                    
                    // MAGIA: Verificamos si mi ID ya está en su lista de seguidores
                    // Usamos == porque miId es texto (localStorage) y el idUsuario es número
                    const yaLoSigo = usuario.seguidores && usuario.seguidores.some(s => s.idUsuario == miId);

                    if (yaLoSigo) {
                        btnSeguirPerfil.textContent = "Siguiendo";
                        btnSeguirPerfil.classList.replace("btn-primary", "btn-success");
                        btnSeguirPerfil.disabled = true;
                    } else {
                        btnSeguirPerfil.textContent = "Seguir";
                        btnSeguirPerfil.classList.replace("btn-success", "btn-primary");
                        btnSeguirPerfil.disabled = false;
                    }
                    
                    // Usamos .onclick en vez de addEventListener para que no se sumen clics repetidos
                    btnSeguirPerfil.onclick = async () => {
                        await seguirUsuario(idPerfilVisita, btnSeguirPerfil);
                    };
                }
            } else {
                perfilUsername.textContent = "Usuario no encontrado";
                perfilNombreCompleto.textContent = "";
            }
        } catch (error) {
            console.error("Error al cargar perfil:", error);
        }
    }

    // 3.aca cargamos las fotos
    async function cargarPublicaciones() {
        try {
            const respuesta = await fetch(`http://localhost:8080/api/publicaciones/usuario/${idPerfilVisita}`);
            if (respuesta.ok) {
                const publicaciones = await respuesta.json();
                mostrarPublicaciones(publicaciones);
            }
        } catch (error) {
            console.error("Error al cargar publicaciones:", error);
        }
    }

    function mostrarPublicaciones(publicaciones) {
        const contenedorPublicaciones = document.getElementById("contenedorPerfilPublicaciones");
        contenedorPublicaciones.innerHTML = "";

        // Actualizamos el contador de la cabecera
        document.getElementById("countPublicaciones").textContent = publicaciones.length;

        if (publicaciones.length === 0) {
            contenedorPublicaciones.innerHTML = `<div class="col-12"><div class="alert alert-light text-center border">Este usuario aún no tiene publicaciones.</div></div>`;
            return;
        }

        publicaciones.forEach(pub => {
            const divCol = document.createElement("div");
            divCol.className = "col-md-6 mb-4";
            
            // Atrapamos la URL y el ID de la imagen
            let urlFoto = "https://via.placeholder.com/400x300?text=Sin+Imagen";
            let idImagen = null;

            if (pub.imagenes && pub.imagenes.length > 0) {
                urlFoto = pub.imagenes[0].urlArchivo;
                idImagen = pub.imagenes[0].id; // Rescatamos el ID de la imagen para las estrellas
            } else if (pub.urlsImagenes && pub.urlsImagenes.length > 0) {
                urlFoto = pub.urlsImagenes[0];
            }

            // Armamos la tarjeta y le sumamos las estrellas si hay una imagen válida
            divCol.innerHTML = `
                <div class="card shadow-sm h-100">
                    <img src="${urlFoto}" class="card-img-top" alt="Foto publicación" style="height: 250px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${pub.titulo}</h5>
                        <p class="card-text text-truncate">${pub.descripcion}</p>
                        
                        ${idImagen ? `
                        <hr>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="estrellas-container" data-id-imagen="${idImagen}">
                                <span class="estrella fs-5 text-muted" style="cursor: pointer;" data-valor="1">★</span>
                                <span class="estrella fs-5 text-muted" style="cursor: pointer;" data-valor="2">★</span>
                                <span class="estrella fs-5 text-muted" style="cursor: pointer;" data-valor="3">★</span>
                                <span class="estrella fs-5 text-muted" style="cursor: pointer;" data-valor="4">★</span>
                                <span class="estrella fs-5 text-muted" style="cursor: pointer;" data-valor="5">★</span>
                            </div>
                            <div class="text-muted small">
                                <span id="promedio-perfil-${idImagen}" class="fw-bold text-warning">0.0</span> 
                                (<span id="cantidad-perfil-${idImagen}">0</span>)
                            </div>
                        </div>
                        ` : ''}

                        <hr>
                        <div class="comentarios-section mt-2">
                            <h6 class="fw-bold mb-2" style="font-size: 0.9rem;">Comentarios</h6>
                            
                            <div id="lista-comentarios-perfil-${pub.idPublicacion}" class="mb-3" style="max-height: 120px; overflow-y: auto; font-size: 0.85rem;">
                                <div class="text-center text-muted small">Cargando comentarios...</div>
                            </div>
                            
                            ${pub.comentariosCerrados ? 
                                `<div class="alert alert-secondary small py-1 text-center mb-0">Comentarios cerrados.</div>` 
                                : 
                                `<div class="input-group input-group-sm">
                                    <input type="text" id="input-comentario-perfil-${pub.idPublicacion}" class="form-control" placeholder="Escribir...">
                                    <button class="btn btn-outline-primary btn-comentar-perfil" data-id-pub="${pub.idPublicacion}">Enviar</button>
                                </div>`
                            }
                        </div>
                    </div>
                </div>
            `;
            
            contenedorPublicaciones.appendChild(divCol);

            // Si atrapamos un ID, mandamos a buscar su promedio a la base de datos
            if (idImagen) {
                cargarEstadisticas(idImagen);
                cargarComentariosPerfil(pub.idPublicacion);
            }
        });
    }
    //  cargar comentarios
    async function cargarComentariosPerfil(idPublicacion) {
        const contenedor = document.getElementById(`lista-comentarios-perfil-${idPublicacion}`);
        if (!contenedor) return;

        try {
            const respuesta = await fetch(`http://localhost:8080/api/comentarios/publicacion/${idPublicacion}`);
            if (respuesta.ok) {
                const comentarios = await respuesta.json();
                
                if (comentarios.length === 0) {
                    contenedor.innerHTML = `<div class="text-muted small text-center">Sé el primero en comentar.</div>`;
                    return;
                }

                contenedor.innerHTML = comentarios.map(com => `
                    <div class="mb-1">
                        <span class="fw-bold text-dark me-1">@${com.usuario.username}</span>
                        <span class="text-secondary">${com.texto}</span>
                    </div>
                `).join("");
                
                contenedor.scrollTop = contenedor.scrollHeight;
            } else {
                contenedor.innerHTML = `<div class="text-danger small text-center">Error al cargar.</div>`;
            }
        } catch (error) {
            console.error("Error cargando comentarios:", error);
            contenedor.innerHTML = `<div class="text-danger small text-center">Error de conexión.</div>`;
        }
    }

    
    // logica de valoraciones
    

    async function cargarEstadisticas(idImagen) {
        try {
            const respuesta = await fetch(`http://localhost:8080/api/valoraciones/estadisticas/${idImagen}`);
            if (respuesta.ok) {
                const stats = await respuesta.json();
                const promedioLimpio = stats.promedio ? stats.promedio.toFixed(1) : "0.0";
                
                // Usamos los IDs con "-perfil-" para actualizar la tarjeta correcta
                document.getElementById(`promedio-perfil-${idImagen}`).textContent = promedioLimpio;
                document.getElementById(`cantidad-perfil-${idImagen}`).textContent = stats.cantidad;
            }
        } catch (error) {
            console.error("Error al cargar estadísticas", error);
        }
    }

    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("estrella")) {
            const puntaje = e.target.getAttribute("data-valor");
            const contenedorEstrellas = e.target.closest(".estrellas-container");
            const idImagen = contenedorEstrellas.getAttribute("data-id-imagen");
            
            const idUsuarioLogueado = localStorage.getItem("usuarioId");

            if (!idUsuarioLogueado) {
                alert("Debes iniciar sesión para valorar.");
                return;
            }

            try {
                const valoracionDTO = {
                    idImagen: parseInt(idImagen),
                    idUsuario: parseInt(idUsuarioLogueado),
                    puntaje: parseInt(puntaje)
                };

                const respuesta = await fetch(`http://localhost:8080/api/valoraciones`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(valoracionDTO)
                });

                if (respuesta.ok) {
                    const estrellas = contenedorEstrellas.querySelectorAll(".estrella");
                    estrellas.forEach((star, index) => {
                        if (index < puntaje) {
                            star.classList.replace("text-muted", "text-warning");
                        } else {
                            star.classList.replace("text-warning", "text-muted");
                        }
                    });

                    // Recargamos los números
                    cargarEstadisticas(idImagen);
                    
                } else {
                    const errorText = await respuesta.text();
                    alert("No se pudo valorar: " + errorText);
                }
            } catch (error) {
                console.error("Error al enviar valoración:", error);
            }
        }


        //mandar comentario
        if (e.target.classList.contains("btn-comentar-perfil")) {
            const idPublicacion = e.target.getAttribute("data-id-pub");
            const inputElement = document.getElementById(`input-comentario-perfil-${idPublicacion}`);
            const texto = inputElement.value.trim();
            const idUsuarioLogueado = localStorage.getItem("usuarioId");

            if (!idUsuarioLogueado) {
                alert("Debes iniciar sesión para comentar.");
                return;
            }

            if (!texto) return;

            try {
                const comentarioDTO = {
                    idUsuario: parseInt(idUsuarioLogueado),
                    idPublicacion: parseInt(idPublicacion),
                    texto: texto
                };

                const respuesta = await fetch(`http://localhost:8080/api/comentarios`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(comentarioDTO)
                });

                if (respuesta.ok) {
                    inputElement.value = "";
                    cargarComentariosPerfil(idPublicacion); // Recargamos para ver el nuevo
                } else {
                    const errorText = await respuesta.text();
                    alert("No se pudo enviar el comentario: " + errorText);
                }
            } catch (error) {
                console.error("Error al enviar comentario:", error);
            }
        }
    });





    // 4. LÓGICA DEL BOTÓN SEGUIR (Reutilizada)
    async function seguirUsuario(idASeguir, botonHTML) {
        try {
            const respuesta = await fetch(`http://localhost:8080/api/usuarios/${miId}/seguir/${idASeguir}`, {
                method: "POST"
            });

            if (respuesta.ok) {
                botonHTML.textContent = "Siguiendo";
                botonHTML.classList.replace("btn-primary", "btn-success");
                botonHTML.disabled = true;
            } else {
                alert("Ya sigues a este usuario o hubo un error.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }


    // subir foto
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