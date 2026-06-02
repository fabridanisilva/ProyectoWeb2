package Facultad.ProyectoWeb.controlador;

import Facultad.ProyectoWeb.DTO.ComentarioDTO;
import Facultad.ProyectoWeb.modelo.Comentario;
import Facultad.ProyectoWeb.servicio.ComentarioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComentarioControlador {

    private final ComentarioServicio comentarioServicio;

    @PostMapping
    public ResponseEntity<?> agregarComentario(@RequestBody ComentarioDTO dto) {
        try {
            Comentario comentario = comentarioServicio.agregarComentario(
                    dto.getIdUsuario(),
                    dto.getIdPublicacion(),
                    dto.getTexto()
            );
            return ResponseEntity.ok(comentario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //  Obtener los comentarios de una publicación
    @GetMapping("/publicacion/{idPublicacion}")
    public ResponseEntity<?> obtenerComentarios(@PathVariable Long idPublicacion) {
        try {
            List<Comentario> comentarios = comentarioServicio.obtenerComentariosPorPublicacion(idPublicacion);
            return ResponseEntity.ok(comentarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // eliminar comentario
    @DeleteMapping("/{idComentario}/usuario/{idUsuario}")
    public ResponseEntity<?> eliminarComentario(@PathVariable Long idComentario, @PathVariable Long idUsuario) {
        try {
            comentarioServicio.eliminarComentario(idUsuario, idComentario);
            return ResponseEntity.ok("Comentario eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
