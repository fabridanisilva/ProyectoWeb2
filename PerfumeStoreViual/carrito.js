const API_PERFUMES = "http://localhost:8080/api/perfumes";
const API_PEDIDOS = "http://localhost:8080/api/pedidos";

async function cargarCarrito() {
    // 1. Traemos la memoria
    let carrito = JSON.parse(localStorage.getItem('carritoPerfumes')) || [];
    const contenedor = document.getElementById('lista-carrito');

    if (carrito.length === 0) {
        contenedor.innerHTML = `<h5 class="text-center text-muted mt-3">Tu carrito está vacío 😢</h5>`;
        document.getElementById('total-carrito').innerText = "$0";
        return;
    }

    // 2. Pedimos todos los perfumes al backend para tener los nombres, fotos y precios reales
    const respuesta = await fetch(API_PERFUMES);
    const catalogoDB = await respuesta.json();

    let html = '';
    let totalPrecio = 0;

    // 3. Cruzamos los datos de la memoria con los de la base de datos
    carrito.forEach(itemLocal => {
        // Buscamos el perfume en el catálogo usando el ID
        const perfumeReal = catalogoDB.find(p => p.id == itemLocal.perfumeId);
        
        if (perfumeReal) {
            const subtotal = perfumeReal.precio * itemLocal.cantidad;
            totalPrecio += subtotal;

            // Adentro del forEach, reemplazá el html += por esto:
html += `
    <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div class="d-flex align-items-center">
            <img src="${perfumeReal.imagen_url}" style="width: 50px; height: 50px; object-fit: contain;" class="me-3">
            <div>
                <h6 class="mb-0">${perfumeReal.marca} ${perfumeReal.nombre}</h6>
                
                <div class="d-flex align-items-center mt-2">
                    <button onclick="cambiarCantidad(${perfumeReal.id}, -1)" class="btn btn-sm btn-outline-dark px-2 py-0">-</button>
                    <span class="mx-3 font-weight-bold">${itemLocal.cantidad}</span>
                    <button onclick="cambiarCantidad(${perfumeReal.id}, 1)" class="btn btn-sm btn-outline-dark px-2 py-0">+</button>
                </div>

            </div>
        </div>
        <span class="font-weight-bold text-success">$${subtotal.toLocaleString()}</span>
    </div>
`;
        }
    });

    contenedor.innerHTML = html;
    document.getElementById('total-carrito').innerText = `$${totalPrecio.toLocaleString()}`;
}

async function confirmarCompra() {
    let carrito = JSON.parse(localStorage.getItem('carritoPerfumes')) || [];
    if (carrito.length === 0) {
        alert("No hay nada en el carrito.");
        return;
    }

    /* Armamos el JSON exactamente como lo espera tu backend (PedidoRequestDTO)
    const pedidoDTO = {
        idUsuario: 1, // ACORDATE: Tenés que tener al menos un usuario con ID 1 en tu tabla de DBeaver
        provincia: document.getElementById('provincia').value,
        ciudad: document.getElementById('ciudad').value,
        direccion: document.getElementById('direccion').value,
        items: carrito // Esto ya tiene el formato {perfumeId, cantidad} que hicimos antes
    };
*/
    // 1. Buscamos quién es el usuario logueado en la memoria
    const usuarioString = localStorage.getItem('usuarioActual');
    
    // 2. Si no hay nadie logueado, lo pateamos a la pantalla de login
    if (!usuarioString) {
        alert("¡Tenés que iniciar sesión para poder comprar!");
        window.location.href = "login.html";
        return;
    }

    const usuarioLogueado = JSON.parse(usuarioString);

    // 3. Armamos el DTO con el ID real de la persona
    const pedidoDTO = {
        idUsuario: usuarioLogueado.id, // <--- ¡AQUÍ ESTÁ LA MAGIA!
        provincia: document.getElementById('provincia').value,
        ciudad: document.getElementById('ciudad').value,
        direccion: document.getElementById('direccion').value,
        items: carrito 
    };

    try {
        const respuesta = await fetch(API_PEDIDOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedidoDTO)
        });

        if (respuesta.ok) {
            alert("¡Pedido realizado con éxito! 🎉");
            localStorage.removeItem('carritoPerfumes'); // Limpiamos la memoria
            window.location.href = "index.html"; // Volvemos al inicio
        } else {
            const errorText = await respuesta.text(); // Por si explota el backend (ej: falta de stock)
            alert("Hubo un error con tu pedido: " + errorText);
        }
    } catch (error) {
        console.error("Error al enviar el pedido:", error);
        alert("Error de conexión con el servidor.");
    }
}
//cambiar la cantidad de perfumes que quieres
function cambiarCantidad(idPerfume, cambio) {
    // 1. Traemos el carrito de la memoria
    let carrito = JSON.parse(localStorage.getItem('carritoPerfumes')) || [];

    // 2. Buscamos el perfume específico
    const item = carrito.find(p => p.perfumeId == idPerfume);

    if (item) {
        // Le sumamos o restamos (el cambio va a ser 1 o -1)
        item.cantidad += cambio;

        // 3. Si la cantidad baja a 0, lo eliminamos de la lista
        if (item.cantidad <= 0) {
            carrito = carrito.filter(p => p.perfumeId != idPerfume);
        }

        // 4. Guardamos la nueva lista en la memoria
        localStorage.setItem('carritoPerfumes', JSON.stringify(carrito));

        // 5. ¡VOLVEMOS A DIBUJAR TODO! 
        // Esto hace que el total cambie en vivo sin recargar la página
        cargarCarrito();
    }
}

// Ejecutar al cargar la página
cargarCarrito();