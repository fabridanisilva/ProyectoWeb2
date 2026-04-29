package Facultad.ProyectoWeb.modelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "publicaciones")
public class Publicacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPublicacion;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "comentarios_cerrados", nullable = false)
    private boolean comentariosCerrados = false;

    // muchas publicaciones son de un autor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario autor;

    // una publicacion tiene una o mas imagenes
    @OneToMany(mappedBy = "publicacion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Imagen> imagenes;

    //muchas publicaciones tienen una o mas etiquetas
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "publicacion_etiqueta",
            joinColumns = @JoinColumn(name = "id_publicacion"),
            inverseJoinColumns = @JoinColumn(name = "id_etiqueta")
    )
    private List<Etiqueta> etiquetas;
}
