package Facultad.ProyectoWeb.DTO;

import lombok.Data;

import java.util.List;

@Data
public class PublicacionCrearDTO {
    private Long idAutor;
    private String titulo;
    private String descripcion;
    private List<String> urlsImagenes;
    private List<String> etiquetas;
}
