package Facultad.ProyectoWeb.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @Column(unique = true,nullable = false)
    @NotBlank
    private String username;

    @NotBlank
    @Column(nullable = false)
    private String nombre;

    @NotBlank
    @Column(nullable = false)
    private String apellido;

    @Email
    @Column(unique = true,nullable = false)
    private String email;

    @Min(18)
    @Column(nullable = false)
    private int edad;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String rol;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "publicaciones_bajadas")
    private int publicacionesBajadas = 0;

    // Relación: Un usuario puede tener muchas publicaciones
    @OneToMany(mappedBy = "autor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Publicacion> publicaciones;


    // Un usuario guarda muchas publicaciones, y una publicación puede ser guardada por muchos [cite: 60]
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "usuario_favoritos",
            joinColumns = @JoinColumn(name = "id_usuario"),
            inverseJoinColumns = @JoinColumn(name = "id_publicacion")
    )
    private List<Publicacion> publicacionesFavoritas;

    // Relación recursiva: Un usuario sigue a muchos usuarios, y es seguido por muchos
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "seguidores",
            joinColumns = @JoinColumn(name = "id_seguido"),
            inverseJoinColumns = @JoinColumn(name = "id_seguidor")
    )
    private List<Usuario> seguidores;
}
