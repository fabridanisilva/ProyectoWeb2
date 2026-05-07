package Facultad.ProyectoWeb.controlador;

import Facultad.ProyectoWeb.DTO.ValoracionRequestDTO;
import Facultad.ProyectoWeb.modelo.Valoracion;
import Facultad.ProyectoWeb.servicio.ValoracionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/valoraciones")
@RequiredArgsConstructor
public class ValoracionControlador {
    ValoracionServicio valoracionServicio;

    @PostMapping
    public ResponseEntity<?> agregarValoracion(@RequestBody ValoracionRequestDTO valoracion){
        return ResponseEntity.ok(valoracionServicio.agregarValoracion(valoracion.getIdImagen(),valoracion.getIdUsuario(),valoracion.getPuntaje()));
    }

    // en este endpoint es para obtener el promedio y la cantidad de valoraciones
    // GET: http://localhost:8080/api/valoraciones/estadisticas/1
    @GetMapping("/estadisticas/{idImagen}")
    public ResponseEntity<?> obtenerEstadisticas(@PathVariable Long idImagen){
        Map<String,Object> map = valoracionServicio.obtenerEstadisticas(idImagen);
        return ResponseEntity.ok(map);
    }
}
