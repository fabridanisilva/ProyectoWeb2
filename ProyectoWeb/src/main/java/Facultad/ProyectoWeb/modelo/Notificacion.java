package Facultad.ProyectoWeb.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNotificacion;

    @NotBlank
    @Column(nullable = false)
    private String tipoEvento;

    @Column(nullable = false)
    LocalDateTime fecha;

    @Column(nullable = false)
    private boolean leida = false;

    // a quien le llega
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_receptor")
    private Usuario receptor;

    // quien la genera
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_generador",nullable = false)
    private Usuario generador;
}
