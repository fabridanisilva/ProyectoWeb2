package ProyectoWeb.repositorio;

import ProyectoWeb.modelo.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallePedidoRepositorio extends JpaRepository<DetallePedido, Long> {

}
