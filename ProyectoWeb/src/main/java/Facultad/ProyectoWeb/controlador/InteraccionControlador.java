package Facultad.ProyectoWeb.controlador;

import Facultad.ProyectoWeb.DTO.ComentarioCrearDTO;
import Facultad.ProyectoWeb.DTO.DenunciaRequestDTO;
import Facultad.ProyectoWeb.DTO.ValoracionRequestDTO;
import Facultad.ProyectoWeb.modelo.Comentario;
import Facultad.ProyectoWeb.modelo.Denuncia;
import Facultad.ProyectoWeb.modelo.Valoracion;
import Facultad.ProyectoWeb.servicio.ComentarioServicio;
import Facultad.ProyectoWeb.servicio.DenunciaServicio;
import Facultad.ProyectoWeb.servicio.ValoracionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interacciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InteraccionControlador {
    private final ValoracionServicio valoracionServicio;
    private final ComentarioServicio comentarioServicio;
    private final DenunciaServicio denunciaServicio;


    //comentarios
    @PostMapping("/comentarios")
    public ResponseEntity<?> agregarComentario(@RequestBody ComentarioCrearDTO dto) {
        try {
            Comentario comentario = comentarioServicio.agregarComentario(dto.getIdUsuario(), dto.getIdPublicacion(), dto.getTexto());
            return ResponseEntity.ok().body(comentario);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/comentarios/{idComentario}")
    public ResponseEntity<?> eliminarComentario(@PathVariable Long idComentario,@RequestParam Long idUsuario) {
        try {
            comentarioServicio.eliminarComentario( idUsuario,idComentario);
            return ResponseEntity.ok().body("Comentario eliminado con exito");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //valoraciones
    @PostMapping("/valoraciones")
    public ResponseEntity<?> valorarImagen(@RequestBody ValoracionRequestDTO dto) {
        try {
            Valoracion valoracion = valoracionServicio.agregarValoracion(dto.getIdImagen(), dto.getIdUsuario(), dto.getPuntaje());
            return ResponseEntity.ok().body(valoracion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/valoraciones/estadisticas/{idImagen}")
    public ResponseEntity<?> obtenerValoracionesEstadisticas(@PathVariable Long idImagen) {
        try {
            Map<String,Object> estadisticas = valoracionServicio.obtenerEstadisticas(idImagen);
            return ResponseEntity.ok().body(estadisticas);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // denuncias
    @PostMapping("/denuncias")
    public ResponseEntity<?> denunciarImagen(@RequestBody DenunciaRequestDTO dto) {
        try {
            Denuncia denuncia = denunciaServicio.denunciarImagen(dto.getIdImagen(), dto.getIdUsuario(), dto.getMotivo(),  dto.getJustificacion());
            return ResponseEntity.ok().body(denuncia);
        }catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/bajar/{idPublicacion}")
    public ResponseEntity<?> bajarImagen(@PathVariable Long idPublicacion) {
        try {
            denunciaServicio.darDeBajaPublicacion(idPublicacion);
            return ResponseEntity.ok().body("Denuncia eliminada con exito");
        }catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
