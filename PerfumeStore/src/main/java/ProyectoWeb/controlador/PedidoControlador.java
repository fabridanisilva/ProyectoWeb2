package ProyectoWeb.controlador;

import ProyectoWeb.DTO.PedidoRequestDTO;
import ProyectoWeb.modelo.Pedido;
import ProyectoWeb.servicio.PedidoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoControlador {

    @Autowired
    private PedidoServicio pedidoServicio;

    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody PedidoRequestDTO pedido) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoServicio.hacerPedido(pedido));
    }
    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Pedido>> obtenerPedidosPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoServicio.obtenerPedidosPorIdUsuario(id));
    }
}
