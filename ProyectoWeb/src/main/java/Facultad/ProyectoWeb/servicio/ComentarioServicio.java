package Facultad.ProyectoWeb.servicio;

import Facultad.ProyectoWeb.modelo.Comentario;
import Facultad.ProyectoWeb.modelo.Publicacion;
import Facultad.ProyectoWeb.modelo.Usuario;
import Facultad.ProyectoWeb.repositorio.ComentarioRepositorio;
import Facultad.ProyectoWeb.repositorio.PublicacionRepositorio;
import Facultad.ProyectoWeb.repositorio.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ComentarioServicio {
    private final ComentarioRepositorio comentarioRepositorio;

    private final UsuarioRepositorio usuarioRepositorio;
    private final PublicacionRepositorio publicacionRepositorio;

    @Transactional
    public Comentario agregarComentario(Long idUsuario, Long idPublicacion, String texto){
        Usuario usuario = usuarioRepositorio.findById(idUsuario).orElseThrow(()-> new RuntimeException("Usuario no encontrado"));
        Publicacion publicacion = publicacionRepositorio.findById(idPublicacion).orElseThrow(()-> new RuntimeException("Publicacion no encontrada"));

        if (publicacion.isComentariosCerrados()){
            throw new RuntimeException("Comentarios cerrados");
        }
        if (texto == null || texto.trim().isEmpty()){
            throw new RuntimeException("Texto no puede estar vacio");
        }

        Comentario comentario = new Comentario();
        comentario.setTexto(texto);
        comentario.setUsuario(usuario);
        comentario.setPublicacion(publicacion);

        return comentarioRepositorio.save(comentario);

    }

    @Transactional
    public void eliminarComentario(Long idUsuario, Long idComentario) {
        Comentario comentario = comentarioRepositorio.findById(idComentario).orElseThrow(()-> new RuntimeException("Comentario no encontrado"));

        boolean esAutorComentario = comentario.getUsuario().getIdUsuario().equals(idUsuario);
        boolean esDueñoDePublicacion = comentario.getPublicacion().getAutor().getIdUsuario().equals(idUsuario);

        if (!esAutorComentario && !esDueñoDePublicacion){
            throw new RuntimeException("No puede borrar un comentario que no es tuyo");
        }
        comentarioRepositorio.delete(comentario);

    }
}
