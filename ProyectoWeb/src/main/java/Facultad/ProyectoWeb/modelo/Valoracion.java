package Facultad.ProyectoWeb.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "valoraciones")
public class Valoracion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idValoracion;

    @Min(1)
    @Max(5)// va a tener valoraciones de 1 a 5 estrellas
    @Column(nullable = false)
    private int puntaje;

    // una valoracion pertenece a una imagen en especifico
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_imagen",nullable = false)
    private Imagen imagen;

    // un usuario hace la valoracion
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario",nullable = false)
    private Usuario usuario;
}
