package Facultad.ProyectoWeb.DTO;

import lombok.Data;

@Data
public class ComentarioCrearDTO {
    private Long idUsuario;
    private Long idPublicacion;
    private String texto;
}
