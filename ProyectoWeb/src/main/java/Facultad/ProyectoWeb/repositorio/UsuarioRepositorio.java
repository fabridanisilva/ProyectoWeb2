package Facultad.ProyectoWeb.repositorio;

import Facultad.ProyectoWeb.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario,Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByUsername(String username);

    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
