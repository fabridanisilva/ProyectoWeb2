package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Etiqueta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EtiquetaRepositorio extends JpaRepository<Etiqueta, Long> {
    Optional<Etiqueta> findByNombre(String nombre);
}
