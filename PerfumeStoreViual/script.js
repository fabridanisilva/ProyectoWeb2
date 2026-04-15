// La URL de tu controlador de perfumes
const API_URL = "http://localhost:8080/api/perfumes";

// Función que pide los perfumes al Backend
async function cargarPerfumes() {
    try {
        const respuesta = await fetch(API_URL);
        const perfumes = await respuesta.json();
        
        const contenedor = document.getElementById('contenedor-perfumes');
        contenedor.innerHTML = ''; // Limpiamos por las dudas

        perfumes.forEach(p => {
            // Adentro de tu perfumes.forEach en script.js:
contenedor.innerHTML += `
    <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
            <img src="${p.imagen_url}" class="card-img-top p-3" alt="${p.nombre}" style="height: 250px; object-fit: contain;">
            <div class="card-body text-center">
                <h5 class="card-title font-weight-bold">${p.marca} ${p.nombre}</h5>
                <h4 class="text-success">$${p.precio.toLocaleString()}</h4>
                
                <a href="producto.html?id=${p.id}" class="btn btn-outline-dark w-100 mb-2">Ver Detalles</a>
                
                <button onclick="agregarAlCarrito(${p.id})" class="btn btn-primary w-100">Agregar al Carrito</button>
            </div>
        </div>
    </div>
`;

        });
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}

// Ejecutamos la función al abrir la página
cargarPerfumes();