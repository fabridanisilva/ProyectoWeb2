package ProyectoWeb.repositorio;

import ProyectoWeb.modelo.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepositorio extends JpaRepository<Pedido, Long> {
    public List<Pedido> findByUsuarioId(Long id);
}
