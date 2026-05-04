package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Imagen;
import Facultad.ProyectoWeb.modelo.Usuario;
import Facultad.ProyectoWeb.modelo.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ValoracionRepositorio extends JpaRepository<Valoracion,Long> {
    boolean existsByImagenAndUsuario(Imagen imagen, Usuario usuario);

    long countByImagen(Imagen imagen);


    @Query("SELECT AVG(v.puntaje) FROM Valoracion v WHERE v.imagen = :imagen")
    Double obtenerPromedioPorImagen(@Param("imagen") Imagen imagen);
}
