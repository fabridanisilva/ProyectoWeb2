package Facultad.ProyectoWeb.controlador;

import Facultad.ProyectoWeb.modelo.Notificacion;
import Facultad.ProyectoWeb.servicio.NotificacionServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class NotificacionControlador {
    private final NotificacionServicio notificacionServicio;

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerNotificaciones(@PathVariable Long idUsuario){
        try {
            List<Notificacion> notificacion = notificacionServicio.obtenerNotificacionesPorUsuario(idUsuario);
            return ResponseEntity.ok(notificacion);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error al obtener la notificacion: "+e.getMessage());
        }
    }

    @PutMapping("/{idNotificacion}/leer")
    public ResponseEntity<?> leerNotificaciones(@PathVariable Long idNotificacion,@RequestParam Long idUsuario){
        try {
            notificacionServicio.marcarComoLeida(idNotificacion,idUsuario);
            return ResponseEntity.ok().body("Notificacion marcada como leida");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error al leer la notificacion: "+e.getMessage());
        }
    }
}
