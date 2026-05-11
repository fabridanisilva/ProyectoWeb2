package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepositorio extends JpaRepository<Notificacion,Long> {
    // esto nos trae las notificaciones del receptor ordenadas por fecha descendente (las más nuevas primero)
    List<Notificacion> findByReceptorIdUsuarioOrderByFechaDesc(Long idReceptor);
}
