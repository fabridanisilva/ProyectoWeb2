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
        const contenedor = document.getElementById("contenedorPerfilPublicaciones");
        contenedor.innerHTML = ""; 

        document.getElementById("countPublicaciones").textContent = publicaciones.length;

        if (publicaciones.length === 0) {
            contenedor.innerHTML = `
                <div class="alert alert-info text-center">
                    Aún no hay publicaciones para mostrar.
                </div>`;
            return;
        }

        publicaciones.forEach(pub => {
            // MAGIA PARA ATRAPAR LA URL:
            // Revisamos si Spring Boot nos mandó la lista de entidades "imagenes"
            let urlFoto = "https://via.placeholder.com/600x400?text=Foto+no+disponible"; // Imagen por defecto
            
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