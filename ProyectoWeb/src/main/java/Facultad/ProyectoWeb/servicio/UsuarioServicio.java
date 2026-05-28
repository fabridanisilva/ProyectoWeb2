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
    private final UsuarioRepositorio usuarioRepositorio;
    private final PublicacionRepositorio publicacionRepositorio;
    private final NotificacionServicio notificacionServicio;


    @Transactional
    public void seguirUsuario(Long idUsuarioActual, Long idUsuarioASeguir) {
        if (idUsuarioActual.equals(idUsuarioASeguir)) {
            throw new IllegalArgumentException("El usuario no puede seguirse a sí mismo");
        }

        Usuario usuarioActual = usuarioRepositorio.findById(idUsuarioActual)
                .orElseThrow(() -> new RuntimeException("Usuario actual no encontrado"));
        Usuario usuarioASeguir = usuarioRepositorio.findById(idUsuarioASeguir)
                .orElseThrow(() -> new RuntimeException("Usuario a seguir no encontrado"));

        // 1. esto es re importante: Validamos contra la lista DUEÑA (seguidos) del usuario actual
        if (usuarioActual.getSeguidos().contains(usuarioASeguir)) {
            throw new IllegalArgumentException("Ya sigues a este usuario");
        }

        // 2. Modificamos el lado DUEÑO (la lista 'seguidos' de quien aprieta el botón)
        usuarioActual.getSeguidos().add(usuarioASeguir);

        // 3. Sincronizamos el lado inverso en memoria (buena práctica para que impacte al instante)
        usuarioASeguir.getSeguidores().add(usuarioActual);

        // 4. Guardamos al usuarioActual (Al ser el dueño, Hibernate ejecuta el INSERT en MySQL)
        usuarioRepositorio.save(usuarioActual);

        // 5. Notificación automática
        notificacionServicio.crearNotificacion(idUsuarioActual, idUsuarioASeguir, "NUEVO_SEGUIDOR");
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
