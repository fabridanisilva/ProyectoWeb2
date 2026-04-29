package Facultad.ProyectoWeb.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "etiquetas")
public class Etiqueta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEtiqueta;

    @NotBlank
    @Column(nullable = false,unique = true)
    private String nombre;

    @ManyToMany(mappedBy = "etiquetas",fetch = FetchType.LAZY)
    private List<Publicacion> publicaciones;
}
