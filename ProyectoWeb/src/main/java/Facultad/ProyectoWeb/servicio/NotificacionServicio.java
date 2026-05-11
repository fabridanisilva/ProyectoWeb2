package Facultad.ProyectoWeb.servicio;

import Facultad.ProyectoWeb.modelo.Notificacion;
import Facultad.ProyectoWeb.modelo.Usuario;
import Facultad.ProyectoWeb.repositorio.NotificacionRepositorio;
import Facultad.ProyectoWeb.repositorio.UsuarioRepositorio;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionServicio {
    private final UsuarioRepositorio usuarioRepositorio;
    private final NotificacionRepositorio notificacionRepositorio;


    @Transactional
    public void crearNotificacion(Long idGenerador, Long idReceptor, String tipoEvento){
        // para que no nos, mandemos una notificacion nosotros mismos
        if (idGenerador.equals(idReceptor)){
            return;
        }

        Usuario generador = usuarioRepositorio.findById(idGenerador).orElseThrow(()-> new RuntimeException("Generador no encontrado"));
        Usuario receptor = usuarioRepositorio.findById(idReceptor).orElseThrow(()-> new RuntimeException("Receptor no encontrado"));

        Notificacion notificacion = new Notificacion();
        notificacion.setGenerador(generador);
        notificacion.setReceptor(receptor);
        notificacion.setTipoEvento(tipoEvento);
        notificacion.setFecha(LocalDateTime.now());
        notificacion.setLeida(false);
        notificacionRepositorio.save(notificacion);
    }

    @Transactional(readOnly = true)
    public List<Notificacion> obtenerNotificacionesPorUsuario(Long idUsuario) {
        return notificacionRepositorio.findByReceptorIdUsuarioOrderByFechaDesc(idUsuario);
    }

    @Transactional
    public void marcarComoLeida(Long idNotificacion, Long idUsuario){
        Notificacion notificacion = notificacionRepositorio.findById(idNotificacion).orElseThrow(()-> new RuntimeException("Notificacion no encontrado"));

        if (!notificacion.getReceptor().equals(idUsuario)){
            throw new RuntimeException("No puedes modificar esta notificacion");
        }

        notificacion.setLeida(true);
        notificacionRepositorio.save(notificacion);

    }

}
