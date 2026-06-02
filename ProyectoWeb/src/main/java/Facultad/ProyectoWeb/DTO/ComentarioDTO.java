package Facultad.ProyectoWeb.DTO;

import lombok.Data;

@Data
public class ComentarioDTO {
    private Long idUsuario;
    private Long idPublicacion;
    private String texto;
}
