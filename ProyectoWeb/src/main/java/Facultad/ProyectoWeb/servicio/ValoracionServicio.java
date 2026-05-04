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

    private ValoracionRepositorio valoracionRepositorio;

    private UsuarioRepositorio usuarioRepositorio;

    private ImagenRepositorio imagenRepositorio;

    @Transactional
    public Valoracion agregarValoracion(Long idImagen, Long idUsuario, int puntaje){
        Imagen imagen = imagenRepositorio.findById(idImagen).orElseThrow(()->new RuntimeException("imagen inexistente"));
        Usuario usuario = usuarioRepositorio.findById(idUsuario).orElseThrow(()->new RuntimeException("usuario inexistente"));

        //no puede valorizar el autor
        if (imagen.getPublicacion().getAutor().getIdUsuario() == usuario.getIdUsuario()){
            throw new RuntimeException("No puedes valorar tu propia publicacion");
        }
        //no puedes valorisar ams de una ves
        if (valoracionRepositorio.existsByImagenAndUsuario(imagen, usuario)){
            throw new RuntimeException("Ya valraste esta imagen");
        }

        Valoracion valoracion = new Valoracion();
        valoracion.setImagen(imagen);
        valoracion.setUsuario(usuario);
        valoracion.setPuntaje(puntaje);
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


}
