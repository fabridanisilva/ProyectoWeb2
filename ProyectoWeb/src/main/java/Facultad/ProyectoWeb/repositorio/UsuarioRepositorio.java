package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario,Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByUsername(String username);
    List<Usuario> findByUsernameContainingIgnoreCaseOrNombreContainingIgnoreCase(String username, String nombre);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

}
