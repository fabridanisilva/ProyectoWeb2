package Facultad.ProyectoWeb.servicio;

import Facultad.ProyectoWeb.modelo.Imagen;
import Facultad.ProyectoWeb.modelo.Usuario;
import Facultad.ProyectoWeb.modelo.Valoracion;
import Facultad.ProyectoWeb.repositorio.ImagenRepositorio;
import Facultad.ProyectoWeb.repositorio.UsuarioRepositorio;
import Facultad.ProyectoWeb.repositorio.ValoracionRepositorio;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ValoracionServicio {

    private final ValoracionRepositorio valoracionRepositorio;

    private final UsuarioRepositorio usuarioRepositorio;
    private final NotificacionServicio notificacionServicio;
    private final ImagenRepositorio imagenRepositorio;

    @Transactional
    public Valoracion agregarValoracion(Long idImagen, Long idUsuario, int puntaje){
        Imagen imagen = imagenRepositorio.findById(idImagen).orElseThrow(()->new RuntimeException("imagen inexistente"));
        Usuario usuario = usuarioRepositorio.findById(idUsuario).orElseThrow(()->new RuntimeException("usuario inexistente"));

        if (puntaje < 1 || puntaje > 5) {
            throw new IllegalArgumentException("El puntaje debe estar entre 1 y 5 estrellas.");
        }

        //no puede valorizar el autor
        if (imagen.getPublicacion().getAutor().getIdUsuario().equals(usuario.getIdUsuario())){
            throw new RuntimeException("No puedes valorar tu propia publicacion");
        }
        //no puedes valorisar ams de una ves
        if (valoracionRepositorio.existsByImagenAndUsuario(imagen, usuario)){
            throw new RuntimeException("Ya valoraste esta imagen");
        }

        Valoracion valoracion = new Valoracion();
        valoracion.setImagen(imagen);
        valoracion.setUsuario(usuario);
        valoracion.setPuntaje(puntaje);

        notificacionServicio.crearNotificacion(
                idUsuario, // El que dejó las estrellas
                imagen.getPublicacion().getAutor().getIdUsuario(), // El dueño de la foto
                "NUEVA_VALORACION"
        );
        return valoracionRepositorio.save(valoracion);
    }

    public Map<String, Object> obtenerEstadisticas(Long idImagen){
        Imagen imagen = imagenRepositorio.findById(idImagen).orElseThrow(()->new RuntimeException("imagen inexistente"));

        long cantidad = valoracionRepositorio.countByImagen(imagen);
        Double promedio = valoracionRepositorio.obtenerPromedioPorImagen(imagen);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("cantidad", cantidad);
        resultado.put("promedio", promedio != null ? Math.round(promedio *  10.0)/10.0 : 0.0);
        return resultado;
    }
    @Transactional()
    public long obtenerTotalValoraciones(Long idImagen) {
        Imagen imagen = imagenRepositorio.findById(idImagen)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));

        return valoracionRepositorio.countByImagen(imagen);
    }

}
