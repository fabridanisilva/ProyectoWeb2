package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Publicacion;
import Facultad.ProyectoWeb.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicacionRepositorio extends JpaRepository<Publicacion, Long> {
    public List<Publicacion> findByAutorIdUsuario(Long idUsuario);
    @Query("SELECT p FROM Publicacion p WHERE p.autor IN (SELECT u FROM Usuario u JOIN u.seguidores s WHERE s.idUsuario = :idUsuario) ORDER BY p.idPublicacion DESC")
    List<Publicacion> findFeedByUsuarioId(@Param("idUsuario") Long idUsuario);
}
