package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Denuncia;
import Facultad.ProyectoWeb.modelo.Imagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DenunciaRepositorio extends JpaRepository<Denuncia,Long> {
    // Cuenta cuántos usuarios distintos denunciaron una imagen
    @Query("SELECT COUNT(DISTINCT d.denunciante) FROM Denuncia d WHERE d.imagen = :imagen")
    long contarDenunciantesDistintosPorImagen(@Param("imagen") Imagen imagen);
}
