package Facultad.ProyectoWeb.controlador;

import Facultad.ProyectoWeb.DTO.UsuarioDTO;
import Facultad.ProyectoWeb.modelo.Usuario;
import Facultad.ProyectoWeb.repositorio.UsuarioRepositorio;
import Facultad.ProyectoWeb.servicio.UsuarioServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioControlador {

    private final UsuarioRepositorio usuarioRepositorio;
    private final UsuarioServicio usuarioServicio;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioDTO DTO){
        try {
            if (usuarioRepositorio.existsByUsername(DTO.getUsername())){
                return ResponseEntity.badRequest().body("El nombre de usuario ya existe");
            }
            if (usuarioRepositorio.existsByEmail(DTO.getEmail())){
                return ResponseEntity.badRequest().body("El email ya esta registrado");
            }

            Usuario usuario = new Usuario();
            usuario.setUsername(DTO.getUsername());
            usuario.setEmail(DTO.getEmail());
            usuario.setPassword(DTO.getPassword());
            usuario.setNombre(DTO.getNombre());
            usuario.setApellido(DTO.getApellido());
            usuario.setEdad(DTO.getEdad());
            usuario.setRol("USER");
            return ResponseEntity.ok(usuarioRepositorio.save(usuario));
        }catch (Exception e){
            return ResponseEntity.internalServerError().body("Error al registrar usuario" + e.getMessage());
        }
    }
    // 2 motor de busqueda (es el item 3)
    // URL: /api/usuarios/buscar?query=juan
    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscarUsuario(@RequestParam String query){
        List<Usuario> usuarios = usuarioRepositorio.findByUsernameContainingIgnoreCaseOrNombreContainingIgnoreCase(query,query);
        return ResponseEntity.ok(usuarios);
    }

    // 3 seguir usuarios
    @PostMapping("/{idSeguidor}/seguir/{idSeguido}")
    public ResponseEntity<?> seguir(@PathVariable Long idSeguidor, @PathVariable Long idSeguido){
        try {
            usuarioServicio.seguirUsuario(idSeguidor, idSeguido);
            return ResponseEntity.ok().body("Ahora sigues a este usuario");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error al seguir usuario: " + e.getMessage());}
    }

    //4 dejar de seguir
    @PostMapping("/{idSeguidor}/unfollow/{idSeguido}")
    public ResponseEntity<?> unfollow(@PathVariable Long idSeguidor, @PathVariable Long idSeguido){
        try {
            usuarioServicio.dejarDeSeguirUsuario(idSeguidor, idSeguido);
            return ResponseEntity.ok().body("Ahora ya no sigues a este usuario");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error al dejar de seguir al usuario: " + e.getMessage());}
    }

    //5 obtener perfil
    @GetMapping("/id/{id}")
    public ResponseEntity<Usuario> obtenerPerfil(@PathVariable Long id){
        return usuarioRepositorio.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());}

    // obtiene perfiles con ese username
    @GetMapping("/perfil/{username}")
    public ResponseEntity<Usuario> obtenerPerfilPorUsername(@PathVariable String username){
        return usuarioRepositorio.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
