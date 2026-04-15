const API_URL = "http://localhost:8080/api/perfumes";

// 1. Extraer el ID de la URL (Ejemplo: producto.html?id=5)
const valoresUrl = window.location.search;
const parametrosUrl = new URLSearchParams(valoresUrl);
const idPerfume = parametrosUrl.get('id');

// 2. Buscar ese perfume en el backend
async function cargarDetallePerfume() {
    try {
        const respuesta = await fetch(`${API_URL}/${idPerfume}`);
        
        if (!respuesta.ok) {
            document.getElementById('detalle-perfume').innerHTML = `<h3 class="text-danger text-center">Perfume no encontrado</h3>`;
            return;
        }

        const p = await respuesta.json();
        
        // 3. Dibujar la pantalla de detalle
        const contenedor = document.getElementById('detalle-perfume');
        contenedor.innerHTML = `
            <div class="row bg-white p-5 rounded shadow-sm">
                <div class="col-md-6 text-center">
                    <img src="${p.imagen_url}" alt="${p.nombre}" class="img-fluid rounded" style="max-height: 400px; object-fit: contain;">
                </div>
                
                <div class="col-md-6 d-flex flex-column justify-content-center">
                    <h5 class="text-muted text-uppercase tracking-wide">${p.marca}</h5>
                    <h2 class="font-weight-bold mb-3">${p.nombre}</h2>
                    <p class="lead">${p.descripcion}</p>
                    <h3 class="text-success font-weight-bold mb-4">$${p.precio.toLocaleString()}</h3>
                    
                    <p class="text-muted">Stock disponible: <strong>${p.stock} unidades</strong></p>
                    
                    <div class="d-flex gap-2">
                        <input type="number" id="cantidad-input" class="form-control text-center" value="1" min="1" max="${p.stock}" style="width: 80px;">
                        <button onclick="agregarAlCarrito(${p.id})" class="btn btn-primary flex-grow-1 text-uppercase font-weight-bold">
                            Agregar al Carrito 🛒
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error al cargar el detalle:", error);
    }
}


function agregarAlCarrito(idPerfume) {
    // 1. Buscamos cuántas unidades eligió el usuario (si no hay input, sumamos 1 por defecto)
    const inputCantidad = document.getElementById('cantidad-input');
    const cantidadElegida = inputCantidad ? parseInt(inputCantidad.value) : 1;

    // 2. Traemos el carrito viejo que esté guardado (si no hay, creamos una lista vacía [])
    let carrito = JSON.parse(localStorage.getItem('carritoPerfumes')) || [];

    // 3. Nos fijamos si este perfume ya estaba en el carrito
    const perfumeExistente = carrito.find(item => item.perfumeId === idPerfume);

    if (perfumeExistente) {
        // Si ya estaba, solo le sumamos la nueva cantidad
        perfumeExistente.cantidad += cantidadElegida;
    } else {
        // Si es nuevo, lo empujamos a la lista
        carrito.push({
            perfumeId: idPerfume,
            cantidad: cantidadElegida
        });
    }

    // 4. Guardamos la lista actualizada en la memoria del navegador
    localStorage.setItem('carritoPerfumes', JSON.stringify(carrito));

    // 5. Le avisamos al usuario
    alert(`¡Listo! Agregaste ${cantidadElegida} unidad(es) al carrito 🛒`);
}

// Ejecutar al cargar la página
cargarDetallePerfume();