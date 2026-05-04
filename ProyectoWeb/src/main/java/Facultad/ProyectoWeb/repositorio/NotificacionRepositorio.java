package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacionRepositorio extends JpaRepository<Notificacion,Long> {
}
