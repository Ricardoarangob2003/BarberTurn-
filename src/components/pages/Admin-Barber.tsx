import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../axiosConfig';

interface Barbero {
  id: string;
  nombre: string;
  especialidad: string;
  local: string;
}

interface Cita {
  id: string;
  nombreCliente: string;
  fecha: string;
  local: string;
  estado: 'completado' | 'pendiente' | 'cancelado';
}

interface DatosAdmin {
  id: string;
  nombre: string;
  local: string;
}

const PanelAdminBarberia: React.FC = () => {
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [datosAdmin, setDatosAdmin] = useState<DatosAdmin | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const datosAdminAlmacenados = localStorage.getItem('adminData');
    if (datosAdminAlmacenados) {
      setDatosAdmin(JSON.parse(datosAdminAlmacenados));
    }
  }, []);

  useEffect(() => {
    const obtenerDatos = async () => {
      if (datosAdmin && datosAdmin.local) {
        try {
          const [respuestaBarberos, respuestaCitas] = await Promise.all([
            api.get('/barberos'),
            api.get('/turnos')
          ]);

          const barberosFiltrados = respuestaBarberos.data.filter((barbero: Barbero) => barbero.local === datosAdmin.local);
          setBarberos(barberosFiltrados);

          const citasFiltradas = respuestaCitas.data.filter((cita: Cita) => cita.local === datosAdmin.local);
          setCitas(citasFiltradas);

          setError(null);
        } catch (error) {
          console.error('Error al obtener datos:', error);
          setError('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
        }
      }
    };

    obtenerDatos();
  }, [datosAdmin]);

  const filtrarCitas = (estado: 'completado' | 'pendiente' | 'cancelado') => {
    return citas.filter(cita => cita.estado === estado);
  };

  if (!datosAdmin) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div style={estilos.error}>{error}</div>;
  }

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.panel}>
        <h1 style={estilos.titulo}>Panel de Administración - {datosAdmin.local}</h1>
        
        <section style={estilos.seccion}>
          <h2 style={estilos.tituloSeccion}>Barberos Registrados</h2>
          <ul style={estilos.lista}>
            {barberos.map(barbero => (
              <li key={barbero.id} style={estilos.elementoLista}>
                {barbero.nombre} - {barbero.especialidad}
              </li>
            ))}
          </ul>
        </section>

        <section style={estilos.seccion}>
          <h2 style={estilos.tituloSeccion}>Citas</h2>
          <div style={estilos.contenedorCitas}>
            <div style={estilos.columnaCitas}>
              <h3 style={estilos.tituloColumna}>Completadas</h3>
              <ul style={estilos.lista}>
                {filtrarCitas('completado').map(cita => (
                  <li key={cita.id} style={estilos.elementoLista}>
                    {cita.nombreCliente} - {cita.fecha}
                  </li>
                ))}
              </ul>
            </div>
            <div style={estilos.columnaCitas}>
              <h3 style={estilos.tituloColumna}>Pendientes</h3>
              <ul style={estilos.lista}>
                {filtrarCitas('pendiente').map(cita => (
                  <li key={cita.id} style={estilos.elementoLista}>
                    {cita.nombreCliente} - {cita.fecha}
                  </li>
                ))}
              </ul>
            </div>
            <div style={estilos.columnaCitas}>
              <h3 style={estilos.tituloColumna}>Canceladas</h3>
              <ul style={estilos.lista}>
                {filtrarCitas('cancelado').map(cita => (
                  <li key={cita.id} style={estilos.elementoLista}>
                    {cita.nombreCliente} - {cita.fecha}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section style={estilos.seccion}>
          <h2 style={estilos.tituloSeccion}>Tickets de Turno</h2>
          <Link to="/ticket-turnos" style={estilos.enlace}>Ir a Tickets de Turno</Link>
        </section>
      </div>
    </div>
  );
};

const estilos = {
  contenedor: {
    backgroundImage: 'url("/assets/imgs/background-gallery.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    padding: '20px',
    width: '100%',
    maxWidth: '1200px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  titulo: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    marginBottom: '20px',
    textAlign: 'center' as const,
    color: '#333',
  },
  seccion: {
    marginBottom: '30px',
  },
  tituloSeccion: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    marginBottom: '10px',
    color: '#444',
  },
  lista: {
    listStyleType: 'none',
    padding: 0,
  },
  elementoLista: {
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  contenedorCitas: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  columnaCitas: {
    flex: 1,
    margin: '0 10px',
  },
  tituloColumna: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    marginBottom: '10px',
    color: '#555',
  },
  enlace: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold' as const,
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    textAlign: 'center' as const,
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    margin: '20px',
  },
};

export default PanelAdminBarberia;