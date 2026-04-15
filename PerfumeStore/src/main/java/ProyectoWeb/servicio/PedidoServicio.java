package ProyectoWeb.servicio;

import ProyectoWeb.DTO.DetallePedidoDTO;
import ProyectoWeb.DTO.PedidoRequestDTO;
import ProyectoWeb.modelo.DetallePedido;
import ProyectoWeb.modelo.Pedido;
import ProyectoWeb.modelo.Perfume;
import ProyectoWeb.modelo.Usuario;
import ProyectoWeb.repositorio.PedidoRepositorio;
import ProyectoWeb.repositorio.PerfumeRepositorio;
import ProyectoWeb.repositorio.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoServicio {
    @Autowired
    private PedidoRepositorio pedidoRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private PerfumeRepositorio perfumeRepositorio;

@Transactional
    public Pedido hacerPedido(PedidoRequestDTO pedidoRequestDTO){
        Usuario usuario = usuarioRepositorio.findById(pedidoRequestDTO.getIdUsuario()).orElseThrow((()->new RuntimeException("Usuario no encontrado")));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setCiudad(pedidoRequestDTO.getCiudad());
        pedido.setDireccion(pedidoRequestDTO.getDireccion());
        pedido.setProvincia(pedidoRequestDTO.getProvincia());
        pedido.setFecha(LocalDate.now());
        pedido.setEstado("PAGADO");
        pedido.setDetalles(new ArrayList<>());


        double totalPedido = 0;

        for (DetallePedidoDTO detallePedido : pedidoRequestDTO.getItems()) {
            Perfume perfume = perfumeRepositorio.findById(detallePedido.getPerfumeId()).orElseThrow((()->new RuntimeException("Perfume no encontrado")));

            if (perfume.getStock()< detallePedido.getCantidad()){
                throw new RuntimeException("No hay stock suficiente de " + perfume.getMarca() +" " + perfume.getNombre());
            }

            DetallePedido detalle = new DetallePedido();
            detalle.setPerfume(perfume);
            detalle.setCantidad(detallePedido.getCantidad());
            detalle.setPrecioUnitario(perfume.getPrecio());
            detalle.setPedido(pedido);
            detalle.setFecha(LocalDate.now());
            perfume.setStock(perfume.getStock() - detallePedido.getCantidad());
            perfumeRepositorio.save(perfume);

            totalPedido += perfume.getPrecio()*detallePedido.getCantidad();
            pedido.getDetalles().add(detalle);

        }
        pedido.setTotal(totalPedido);
        return pedidoRepositorio.save(pedido);
    }

    public List<Pedido> obtenerPedidosPorIdUsuario(Long id){

        return pedidoRepositorio.findByUsuarioId(id);

    }
}
