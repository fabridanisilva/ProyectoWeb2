package Facultad.ProyectoWeb.servicio;

import Facultad.ProyectoWeb.modelo.Publicacion;
import Facultad.ProyectoWeb.modelo.Usuario;
import Facultad.ProyectoWeb.repositorio.DenunciaRepositorio;
import Facultad.ProyectoWeb.repositorio.PublicacionRepositorio;
import Facultad.ProyectoWeb.repositorio.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioServicio {
    private UsuarioRepositorio usuarioRepositorio;
    private PublicacionRepositorio publicacionRepositorio;


    @Transactional
    public void seguirUsuario(Long idUsuarioActual, Long idUsuarioASeguir) {
        if (idUsuarioActual == idUsuarioASeguir) {
            throw new IllegalArgumentException("El usuario no puede serguirse asi mismo");
        }

        Usuario usuarioActual = usuarioRepositorio.findById(idUsuarioActual).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Usuario usuarioASeguir = usuarioRepositorio.findById(idUsuarioASeguir).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuarioASeguir.getSeguidores().contains(usuarioActual)) {
            throw new IllegalArgumentException("Ya sigues a este usuario");
        }

        usuarioASeguir.getSeguidores().add(usuarioActual);
        usuarioRepositorio.save(usuarioASeguir);
    }

    @Transactional
    public void dejarDeSeguirUsuario(Long idUsuarioActual, Long idUsuarioADejar){
        Usuario usuarioActual = usuarioRepositorio.findById(idUsuarioActual).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Usuario usuarioDejar = usuarioRepositorio.findById(idUsuarioADejar).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuarioDejar.getSeguidores().remove(usuarioActual);
        usuarioRepositorio.save(usuarioDejar);

    }

    @Transactional
    public void guardarPublicacionFavorita(Long idUsuario, Long idPublicacion) {
        Usuario usuario = usuarioRepositorio.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Publicacion publicacion = publicacionRepositorio.findById(idPublicacion).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getPublicacionesFavoritas().contains(publicacion)) {
            throw new IllegalArgumentException("Ya esta guardado en lso favoritos del usuario");
        }
        usuario.getPublicacionesFavoritas().add(publicacion);
        usuarioRepositorio.save(usuario);
    }
    @Transactional
    public void removerPublicacionFavorita(Long idUsuario, Long idPublicacion) {
        Usuario usuario = usuarioRepositorio.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Publicacion publicacion = publicacionRepositorio.findById(idPublicacion)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));

        usuario.getPublicacionesFavoritas().remove(publicacion);
        usuarioRepositorio.save(usuario);
    }
}
