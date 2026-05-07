package Facultad.ProyectoWeb.DTO;

import lombok.Data;

@Data
public class ValoracionRequestDTO {
    private Long idImagen;
    private Long idUsuario;
    private int puntaje;
}
