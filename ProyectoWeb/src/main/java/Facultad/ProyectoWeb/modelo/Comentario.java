package Facultad.ProyectoWeb.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "comentarios")
public class Comentario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idComentarios;

    @NotBlank
    @Column(nullable = false,columnDefinition = "TEXT")
    private String texto;

    // un comentario pertenece a una publicacion
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_publicacion",nullable = false)
    private Publicacion publicacion;
// un usuario realiza el comentario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario",nullable = false)
    private Usuario usuario;
}
