package ProyectoWeb.servicio;

import ProyectoWeb.modelo.Perfume;
import ProyectoWeb.repositorio.PerfumeRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PerfumeServicio {
    @Autowired
    private PerfumeRepositorio perfumeRepositorio;

    public Perfume ingresar(Perfume perfume) {

        return perfumeRepositorio.save(perfume);
    }
    public Perfume actualizar(Perfume perfume) {
        return perfumeRepositorio.save(perfume);
    }
    public Perfume buscarPorId(Long id) {
        return perfumeRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfume no encontrado"));
    }
    public List<Perfume> listarPerfumes() {
        return perfumeRepositorio.findAll();
    }

    public void eliminar(long id) {
        perfumeRepositorio.deleteById(id);
    }

    public List<Perfume> obtenerPorMarca(String marca) {
        return perfumeRepositorio.findByMarca(marca);
    }


}
