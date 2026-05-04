package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComentarioRepositorio extends JpaRepository<Comentario,Long> {
}
