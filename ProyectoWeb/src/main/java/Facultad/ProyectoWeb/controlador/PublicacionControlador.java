package Facultad.ProyectoWeb.controlador;

import Facultad.ProyectoWeb.DTO.PublicacionCrearDTO;
import Facultad.ProyectoWeb.modelo.Publicacion;
import Facultad.ProyectoWeb.repositorio.PublicacionRepositorio;
import Facultad.ProyectoWeb.servicio.PublicacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publicaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PublicacionControlador {

    private final PublicacionServicio publicacionServicio;
    private final PublicacionRepositorio publicacionRepositorio;


    @PostMapping
    public ResponseEntity<?> crearPublicacion(@RequestBody PublicacionCrearDTO dto) {
        try {
            Publicacion publicacion = publicacionServicio.crearPublicacion(dto.getIdAutor(), dto.getTitulo(), dto.getDescripcion(),dto.getEtiquetas(), dto.getUrlsImagenes());
            return ResponseEntity.ok(publicacion);
        }catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.internalServerError().body("Error al crear la publicacion: " + e.getMessage());
        }
    }
    //obtener publicaciones de un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Publicacion>> obtenerPublicaciones(@PathVariable Long idUsuario) {
        List<Publicacion> publicaciones = publicacionRepositorio.findByAutorIdUsuario(idUsuario);
        return ResponseEntity.ok(publicaciones);
    }

    //obtener una publicacion en especifico
    @GetMapping("/{id}")
    public ResponseEntity<Publicacion> obtenerPublicacionPorId(@PathVariable Long id) {
        Publicacion publicacion = publicacionRepositorio.findById(id).orElseThrow(() -> new RuntimeException("Publicacion no encontrada"));
        return ResponseEntity.ok(publicacion);
    }

    // abrir o cerrar los comentarios
    @PutMapping("/{id}/comentarios")
    public ResponseEntity<?> alternarComentarios(@PathVariable Long id, @RequestParam Long idUsuario, @RequestParam boolean cerrar) {
        try {
            publicacionServicio.alternarEstadoComentarios(id,idUsuario,cerrar);
            String mensaje = cerrar ? "Los comentarios han sido cerrados." : "Los comentarios han sido abiertos.";
            return ResponseEntity.ok(mensaje);
        }catch (Exception e){
            return ResponseEntity.internalServerError().body("No se pude modificar el estado de los comentarios "+e.getMessage());
        }
    }


    // 5. Publicaciones de la gente que sigo
    // URL: /api/publicaciones/feed/1
    @GetMapping("/feed/{idUsuario}")
    public ResponseEntity<List<Publicacion>> obtenerFeed(@PathVariable Long idUsuario) {
        try {
            List<Publicacion> feed = publicacionServicio.obtenerFeedDeUsuario(idUsuario);
            return ResponseEntity.ok(feed);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
