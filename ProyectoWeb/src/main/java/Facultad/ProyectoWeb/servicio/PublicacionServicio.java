package Facultad.ProyectoWeb.servicio;

import Facultad.ProyectoWeb.modelo.Etiqueta;
import Facultad.ProyectoWeb.modelo.Imagen;
import Facultad.ProyectoWeb.modelo.Publicacion;
import Facultad.ProyectoWeb.modelo.Usuario;
import Facultad.ProyectoWeb.repositorio.EtiquetaRepositorio;
import Facultad.ProyectoWeb.repositorio.PublicacionRepositorio;
import Facultad.ProyectoWeb.repositorio.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class PublicacionServicio {
    private final PublicacionRepositorio publicacionRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final EtiquetaRepositorio etiquetaRepositorio;


    @Transactional
    private Publicacion crearPublicacion(Long idAutor, String titulo, String descripcion, String urlArchivo, List<String> nombresEtiquetas,List<String> urlsImagenes) {
        Usuario usuario = usuarioRepositorio.findById(idAutor).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (urlArchivo == null || urlsImagenes.isEmpty()) {
            throw new IllegalArgumentException("El archivo no puede ser nulo.");
        }
        if (nombresEtiquetas == null || nombresEtiquetas.isEmpty()) {
            throw new IllegalArgumentException("La publicación debe tener al menos una etiqueta");
        }

        Publicacion publicacion = new Publicacion();
        publicacion.setTitulo(titulo);
        publicacion.setDescripcion(descripcion);
        publicacion.setAutor(usuario);
        publicacion.setComentariosCerrados(false);


        // manejo de las imagenes
        List<Imagen> imagenes = new ArrayList<>();
        for (String urlImagen : urlsImagenes) {
            Imagen imagen = new Imagen();
            imagen.setUrlArchivo(urlImagen);
            imagen.setPublicacion(publicacion);
            imagenes.add(imagen);
        }
        publicacion.setImagenes(imagenes);

        // manejo de las etiquetas
        List<Etiqueta> etiquetas = new ArrayList<>();
        for (String nombre : nombresEtiquetas) {
            Etiqueta etiqueta = etiquetaRepositorio.findByNombre(nombre.toLowerCase()).orElseGet(() -> {
                Etiqueta nueva = new Etiqueta();
                nueva.setNombre(nombre.toLowerCase().trim());
                return etiquetaRepositorio.save(nueva);
            });
            etiquetas.add(etiqueta);
        }
        publicacion.setEtiquetas(etiquetas);

        return publicacionRepositorio.save(publicacion);
    }
    @Transactional
    public void alternarEstadoComentarios(Long idPublicacion, Long idUsuario, boolean cerrarComentarios) {
        Publicacion publicacion = publicacionRepositorio.findById(idPublicacion)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));

        // Validamos que solo el autor pueda cerrar los comentarios
        if (!publicacion.getAutor().getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("Solo el autor de la publicación puede modificar los comentarios");
        }

        publicacion.setComentariosCerrados(cerrarComentarios);
        publicacionRepositorio.save(publicacion);
    }
}
