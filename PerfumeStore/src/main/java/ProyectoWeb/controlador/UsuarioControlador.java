package ProyectoWeb.controlador;

import ProyectoWeb.DTO.LoginDTO;
import ProyectoWeb.modelo.Usuario;
import ProyectoWeb.servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioControlador {
    @Autowired
    private UsuarioServicio usuarioServicio;


    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody Usuario usuario){
        return ResponseEntity.ok(usuarioServicio.registrarUsuario(usuario));
    }
    @GetMapping
    public ResponseEntity<Usuario> buscarUsuarioPorEmail(@RequestParam String email){
        return  ResponseEntity.ok(usuarioServicio.buscarUsuarioPorEmail(email));
    }
    @GetMapping("/usuario/listar")
    public ResponseEntity<List<Usuario>> listarUsuarios(){
        return ResponseEntity.ok(usuarioServicio.listarUsuarios());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        // Buscamos a todos los usuarios y filtramos (forma rústica pero efectiva para aprender)
        List<Usuario> todos = usuarioServicio.listarUsuarios();

        for (Usuario u : todos) {
            if (u.getEmail().equals(loginDTO.getEmail()) && u.getPassword().equals(loginDTO.getPassword())) {
                return ResponseEntity.ok(u); // Si coincide, devolvemos el usuario entero
            }
        }

        // Si termina el loop y no encontró nada, tira error 401 (No autorizado)
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
    }
}
