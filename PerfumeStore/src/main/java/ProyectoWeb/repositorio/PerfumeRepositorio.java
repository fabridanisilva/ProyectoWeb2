package ProyectoWeb.repositorio;

import ProyectoWeb.modelo.Perfume;
import ProyectoWeb.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PerfumeRepositorio extends JpaRepository<Perfume,Long> {
    public List<Perfume> findByMarca(String marca);

}
