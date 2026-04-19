const API_URL = "http://localhost:8080/api/perfumes";

// Guardamos todos los perfumes acá para no pedirlos a la base de datos a cada rato
let catalogoCompleto = []; 

async function cargarPerfumes() {
    try {
        const respuesta = await fetch(API_URL);
        catalogoCompleto = await respuesta.json();
        
        cargarMarcasEnElFiltro(); // Llenamos el desplegable de marcas
        renderizarPerfumes(catalogoCompleto); // Dibujamos todos al principio

    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}

// Llenamos el "Select" con las marcas que realmente existen en tu base de datos
function cargarMarcasEnElFiltro() {
    const selectMarca = document.getElementById('filtro-marca');
    
    // Esto es magia de JS: Busca todas las marcas, y Set() borra las repetidas
    const marcasUnicas = [...new Set(catalogoCompleto.map(p => p.marca))];
    
    marcasUnicas.forEach(marca => {
        selectMarca.innerHTML += `<option value="${marca}">${marca}</option>`;
    });
}

// Esta función es la que dibuja las tarjetas (la separamos para poder reusarla)
function renderizarPerfumes(listaPerfumes) {
    const contenedor = document.getElementById('contenedor-perfumes');
    contenedor.innerHTML = ''; // Limpiamos la pantalla

    if (listaPerfumes.length === 0) {
        contenedor.innerHTML = `<h4 class="text-center text-muted w-100 mt-4">No se encontraron perfumes con estos filtros 😢</h4>`;
        return;
    }

    listaPerfumes.forEach(p => {
        contenedor.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${p.imagen_url}" class="card-img-top p-3" alt="${p.nombre}" style="height: 250px; object-fit: contain;">
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="card-title font-weight-bold">${p.marca} ${p.nombre}</h5>
                        <h4 class="text-success my-3">$${p.precio.toLocaleString()}</h4>
                        
                        <div class="mt-auto">
                            <a href="producto.html?id=${p.id}" class="btn btn-outline-dark w-100 mb-2">Ver Detalles</a>
                            <button onclick="agregarAlCarrito(${p.id})" class="btn btn-primary w-100">Agregar al Carrito</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// EL MOTOR DE FILTRADO: Se ejecuta cada vez que tocas el precio o cambias la marca
function aplicarFiltros() {
    const marcaElegida = document.getElementById('filtro-marca').value;
    const precioMaximo = document.getElementById('filtro-precio').value;

    // Actualizamos el textito verde del precio para que el usuario vea cuánto eligió
    document.getElementById('label-precio').innerText = `$${parseInt(precioMaximo).toLocaleString()}`;

    // Filtramos la lista global
    const perfumesFiltrados = catalogoCompleto.filter(p => {
        // ¿Pasa la prueba de la marca? (Si eligió "Todas", pasan todos)
        const cumpleMarca = (marcaElegida === "Todas") || (p.marca === marcaElegida);
        
        // ¿Pasa la prueba del precio?
        const cumplePrecio = p.precio <= parseInt(precioMaximo);

        // Solo sobrevive si cumple ambas condiciones
        return cumpleMarca && cumplePrecio;
    });

    // Dibujamos los que sobrevivieron al filtro
    renderizarPerfumes(perfumesFiltrados);
}

// Ejecutamos la carga inicial
cargarPerfumes();

// Función del carrito (que ya tenías)
function agregarAlCarrito(idPerfume) {
    let carrito = JSON.parse(localStorage.getItem('carritoPerfumes')) || [];
    const perfumeExistente = carrito.find(item => item.perfumeId == idPerfume);

    if (perfumeExistente) {
        perfumeExistente.cantidad += 1;
    } else {
        carrito.push({ perfumeId: idPerfume, cantidad: 1 });
    }

    localStorage.setItem('carritoPerfumes', JSON.stringify(carrito));
    alert(`¡Perfume agregado al carrito! 🛒`);
}