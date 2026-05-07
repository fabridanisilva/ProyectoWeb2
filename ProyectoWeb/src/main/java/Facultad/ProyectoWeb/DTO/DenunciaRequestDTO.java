package Facultad.ProyectoWeb.DTO;

import lombok.Data;

@Data
public class DenunciaRequestDTO {
    private Long idImagen;
    private Long idUsuario;
    private String motivo;
    private String justificacion;
}
