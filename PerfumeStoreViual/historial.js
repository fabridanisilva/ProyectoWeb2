const API_PEDIDOS = "http://localhost:8080/api/pedidos";

async function cargarHistorial() {
    const contenedor = document.getElementById('contenedor-historial');
    
    // 1. Verificamos quién es el usuario
    const usuarioString = localStorage.getItem('usuarioActual');
    if (!usuarioString) {
        window.location.href = "login.html";
        return;
    }

    const usuarioLogueado = JSON.parse(usuarioString);

    try {
        // 2. Le pedimos a Java los pedidos de este ID específico
        const respuesta = await fetch(`${API_PEDIDOS}/usuario/${usuarioLogueado.id}`);
        
        if (!respuesta.ok) throw new Error("Error al buscar pedidos");
        
        const pedidos = await respuesta.json();

        // 3. Si no compró nada todavía
        if (pedidos.length === 0) {
            contenedor.innerHTML = `
                <div class="text-center mt-5">
                    <h4 class="text-muted">Todavía no hiciste ninguna compra 😢</h4>
                    <a href="index.html" class="btn btn-primary mt-3">Ir a la tienda</a>
                </div>`;
            return;
        }

        // 4. Si tiene compras, armamos el HTML
        let html = '';
        
        // Damos vuelta el array (reverse) para que las compras más nuevas salgan arriba
        pedidos.reverse().forEach(pedido => {
            // Formateamos la fecha (viene fea desde Java, ej: 2026-04-15T14:30:00)
            const fechaLimpia = new Date(pedido.fechaCreacion).toLocaleDateString('es-AR');

            html += `
                <div class="card mb-4 shadow-sm border-0">
                    <div class="card-header bg-dark text-white d-flex justify-content-between">
                        <span><strong>Pedido #${pedido.id}</strong> - ${fechaLimpia}</span>
                        <span class="text-success font-weight-bold">Total: $${pedido.total.toLocaleString()}</span>
                    </div>
                    <div class="card-body">
                        <p class="text-muted mb-1"><small>📍 Enviado a: ${pedido.direccion}, ${pedido.ciudad} (${pedido.provincia}), fecha de compra: ${pedido.fecha} </small></p>
                        <hr>
                        <ul class="list-unstyled mb-0">
            `;

            // ¡OJO ACÁ! Acá vas a tener que revisar cómo se llama tu lista de detalles en la entidad Pedido de Java.
            // Si en Java pusiste `private List<DetallePedido> detalles;`, acá tenés que usar `pedido.detalles`.
            // Si pusiste `items`, usá `pedido.items`.
            
            // Asumiendo que se llama 'detalles':
            if (pedido.detalles && pedido.detalles.length > 0) {
                pedido.detalles.forEach(detalle => {
                    html += `<li>✅ ${detalle.cantidad}x ${detalle.perfume.marca} ${detalle.perfume.nombre} - $${(detalle.precioUnitario * detalle.cantidad).toLocaleString()}</li>`;
                });
            } else {
                html += `<li><i class="text-muted">Detalles no disponibles.</i></li>`;
            }

            html += `
                        </ul>
                    </div>
                </div>
            `;
        });

        contenedor.innerHTML = html;

    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = `<h5 class="text-danger text-center mt-5">Hubo un error al cargar tu historial.</h5>`;
    }
}

// Ejecutar apenas carga la página
cargarHistorial();