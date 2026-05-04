package Facultad.ProyectoWeb.servicio;

import Facultad.ProyectoWeb.modelo.Denuncia;
import Facultad.ProyectoWeb.modelo.Imagen;
import Facultad.ProyectoWeb.modelo.Publicacion;
import Facultad.ProyectoWeb.modelo.Usuario;
import Facultad.ProyectoWeb.repositorio.DenunciaRepositorio;
import Facultad.ProyectoWeb.repositorio.ImagenRepositorio;
import Facultad.ProyectoWeb.repositorio.PublicacionRepositorio;
import Facultad.ProyectoWeb.repositorio.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DenunciaServicio {

    private DenunciaRepositorio denunciaRepositorio;

    ImagenRepositorio imagenRepositorio;

    UsuarioRepositorio usuarioRepositorio;

    PublicacionRepositorio publicacionRepositorio;

    @Transactional
    public Denuncia denunciarImagen(Long idImagen,Long idUsuario, String motivo,String justificacion) {
        Imagen imagen = imagenRepositorio.findById(idImagen).orElseThrow(()-> new RuntimeException("imagen inexistente"));
        Usuario usuario = usuarioRepositorio.findById(idUsuario).orElseThrow(()-> new RuntimeException("usuario inexistente"));

        Denuncia denuncia = new Denuncia();
        denuncia.setImagen(imagen);
        denuncia.setJustificacion(justificacion);
        denuncia.setDenunciante(usuario);
        denuncia.setMotivo(motivo);

        denunciaRepositorio.save(denuncia);

        //si tiene mas de 3 denuncias diferentes de usuarios, se va a validar
        long cantidadDenunciantes = denunciaRepositorio.contarDenunciantesDistintosPorImagen(imagen);
        if (cantidadDenunciantes > 3) {
            // cuestionandome si tener un campo booleano en Publicacion que sea "enRevision"
            // por ahora lo dejamos asi.
            System.out.println("ALERTA: Publicación " + imagen.getPublicacion().getIdPublicacion() + " enviada al validador.");
        }

        return denuncia;
    }

    @Transactional
    public void darDeBajaPublicacion(Long idPublicacion) {
        Publicacion publicacion = publicacionRepositorio.findById(idPublicacion).orElseThrow(()-> new RuntimeException("publicacion inexistente"));
        Usuario usuario = publicacion.getAutor();
        usuario.setPublicacionesBajadas(usuario.getPublicacionesBajadas() + 1);

        if (usuario.getPublicacionesBajadas() >= 3) {
            usuario.setActivo(false);
            System.out.println("Cuenta inabilitada: " + usuario.getUsername());
        }

        usuarioRepositorio.save(usuario);
    }
}
