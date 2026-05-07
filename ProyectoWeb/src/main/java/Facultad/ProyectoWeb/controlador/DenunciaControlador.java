package Facultad.ProyectoWeb.controlador;

import Facultad.ProyectoWeb.DTO.DenunciaRequestDTO;
import Facultad.ProyectoWeb.servicio.DenunciaServicio;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/denuncias")
@RequiredArgsConstructor
public class DenunciaControlador {
    DenunciaServicio denunciaServicio;

    @PostMapping
    public ResponseEntity<?> denunciarImagen(@RequestBody DenunciaRequestDTO denuncia){
        return ResponseEntity.ok(denunciaServicio.denunciarImagen(denuncia.getIdImagen(),denuncia.getIdUsuario(),denuncia.getMotivo(),denuncia.getJustificacion()));
    }

    @PostMapping("/baja/{idPublicacion}")
    public ResponseEntity<?> baja(@PathVariable Long idPublicacion){
        denunciaServicio.darDeBajaPublicacion(idPublicacion);
        return ResponseEntity.ok("Publicacion dada de baja");
    }

}
