package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Imagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImagenRepositorio extends JpaRepository<Imagen,Long> {
}
