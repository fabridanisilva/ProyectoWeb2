package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioRepositorio extends JpaRepository<Comentario,Long> {
    List<Comentario> findByPublicacion_IdPublicacion(Long idPublicacion);
}
