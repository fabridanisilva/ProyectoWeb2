package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicacionRepositorio extends JpaRepository<Publicacion, Long> {
}
