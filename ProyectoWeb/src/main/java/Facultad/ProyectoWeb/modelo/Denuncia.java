package Facultad.ProyectoWeb.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.awt.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "denuncias")
public class Denuncia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEtiqueta;

    @NotBlank
    @Column(nullable = false)
    private String motivo;

    @NotBlank
    @Column(nullable = false,columnDefinition = "TEXT")
    private String justificacion;

    // quien realiza la denuncia
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_denunciante", nullable = false)
    private Usuario denunciante;

    //que imagen se denuncia
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_imagen")
    private Imagen imagen;
    //que comentario se denuncia
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_comentario")
    private Comentario comentario;
}
