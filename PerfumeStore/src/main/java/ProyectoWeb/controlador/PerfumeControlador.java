package ProyectoWeb.controlador;

import ProyectoWeb.modelo.Perfume;
import ProyectoWeb.repositorio.PerfumeRepositorio;
import ProyectoWeb.servicio.PerfumeServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/perfumes")
@CrossOrigin(origins = "*")
public class PerfumeControlador {
    @Autowired
    private PerfumeServicio perfumeServicio;

    @PostMapping
    public ResponseEntity<Perfume> agregarPerfume(@RequestBody Perfume perfume) {
        return ResponseEntity.ok(perfumeServicio.ingresar(perfume));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perfume> buscarPerfumePorId(@PathVariable Long id) {
        return ResponseEntity.ok(perfumeServicio.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Perfume>> obtenerPerfumes() {
        return ResponseEntity.ok(perfumeServicio.listarPerfumes());
    }
    @GetMapping("/marca/{marca}")
    public ResponseEntity<List<Perfume>> obtenerPerfumePorMarca(@PathVariable String marca) {
        return ResponseEntity.ok(perfumeServicio.obtenerPorMarca(marca));
    }


}
