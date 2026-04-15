package ProyectoWeb.DTO;

import ProyectoWeb.modelo.DetallePedido;
import lombok.Data;

import java.util.List;

@Data
public class PedidoRequestDTO {
    private Long idUsuario;
    private List<DetallePedidoDTO> items;
    private String direccion;
    private String ciudad;
    private String provincia;
}
