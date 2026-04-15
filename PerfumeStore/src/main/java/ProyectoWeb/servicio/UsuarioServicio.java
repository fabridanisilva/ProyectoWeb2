package ProyectoWeb.servicio;

import ProyectoWeb.modelo.Usuario;
import ProyectoWeb.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsuarioServicio {
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;




    public Usuario registrarUsuario(Usuario usuario){
        if (usuarioRepositorio.existsByEmail(usuario.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El email " + usuario.getEmail() + " ya está registrado."
            );
        }



        if (usuario.getRol() == null || usuario.getRol().isEmpty()){
            usuario.setRol("CLIENTE");
        }

        return usuarioRepositorio.save(usuario);
    }

    public List<Usuario> listarUsuarios(){
        return usuarioRepositorio.findAll();
    }

    public Usuario buscarUsuarioPorEmail(String email){
        return usuarioRepositorio.findByEmail(email);
    }
}
