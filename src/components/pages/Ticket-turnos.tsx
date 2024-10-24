import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { ArrowLeft } from 'lucide-react';

interface Turno {
  id: string;
  hora: string;
  numeroturno: string;
  barberia: string;
  fecha: string;
}

const ListaTurnos: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [turnoActual, setTurnoActual] = useState<Turno | null>(null);
  const [barberiaFiltrada, setBarberiaFiltrada] = useState<string | null>(null);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await axiosInstance.get('turnero');
        const allTurnos = response.data;
        
        const localBarberia = localStorage.getItem('local');
        setBarberiaFiltrada(localBarberia);

        const turnosFiltrados = localBarberia
          ? allTurnos.filter((turno: Turno) => turno.barberia === localBarberia)
          : allTurnos;

        setTurnos(turnosFiltrados);
        if (turnosFiltrados.length > 0) {
          setTurnoActual(turnosFiltrados[0]);
        }
      } catch (error) {
        console.error('Error al obtener los turnos:', error);
      }
    };

    fetchTurnos();
  }, []);

  const pasarAlSiguienteTurno = () => {
    if (turnos.length > 0) {
      const turnoActualIndex = turnos.findIndex(turno => turno.id === turnoActual?.id);
      if (turnoActualIndex < turnos.length - 1) {
        setTurnoActual(turnos[turnoActualIndex + 1]);
      } else {
        setTurnoActual(turnos[0]);
      }
    }
  };

  const formatearFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearHora = (horaString: string) => {
    const [horas, minutos] = horaString.split(':');
    return `${horas}:${minutos}`;
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <Link to="/Dashboard-Barberia" style={styles.backButton}>
          <ArrowLeft size={20} />
          Volver
        </Link>
        <h2 style={styles.title}>Lista de Turnos</h2>
        {barberiaFiltrada && (
          <p style={styles.barberiaInfo}>Mostrando turnos para: {barberiaFiltrada}</p>
        )}
        <div style={styles.turnoActualContainer}>
          <AnimatePresence>
            {turnoActual && (
              <motion.div
                key={turnoActual.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                style={styles.turnoActual}
              >
                <h3 style={styles.turnoActualTitle}>Turno Actual</h3>
                <p style={styles.turnoActualNumero}>{turnoActual.numeroturno}</p>
                <p style={styles.turnoActualInfo}>Barbería: {turnoActual.barberia}</p>
                <p style={styles.turnoActualInfo}>Fecha: {formatearFecha(turnoActual.fecha)}</p>
                <p style={styles.turnoActualInfo}>Hora: {formatearHora(turnoActual.hora)}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={pasarAlSiguienteTurno} style={styles.button}>
          Siguiente Turno
        </button>
        <div style={styles.listaTurnos}>
          <h3 style={styles.subtitle}>Próximos Turnos</h3>
          {turnos.map((turno, index) => (
            <motion.div
              key={turno.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={{
                ...styles.turnoItem,
                ...(turno.id === turnoActual?.id ? styles.turnoItemActivo : {})
              }}
            >
              <span style={styles.turnoNumero}>{turno.numeroturno}</span>
              <span style={styles.turnoBarberia}>{turno.barberia}</span>
              <span style={styles.turnoFecha}>{formatearFecha(turno.fecha)}</span>
              <span style={styles.turnoHora}>{formatearHora(turno.hora)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundImage: 'url("/assets/imgs/background-gallery.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    maxWidth: '600px',
    width: '100%',
    margin: '20px',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const,
  },
  backButton: {
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    textDecoration: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    textAlign: 'center' as const,
    marginBottom: '20px',
    marginTop: '30px',
    color: '#333',
  },
  barberiaInfo: {
    textAlign: 'center' as const,
    marginBottom: '10px',
    fontSize: '16px',
    color: '#666',
  },
  turnoActualContainer: {
    minHeight: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
  turnoActual: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  turnoActualTitle: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  turnoActualNumero: {
    fontSize: '36px',
    fontWeight: 'bold' as const,
    marginBottom: '10px',
  },
  turnoActualInfo: {
    fontSize: '14px',
    marginBottom: '5px',
  },
  button: {
    backgroundColor: '#008CBA',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center' as const,
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '10px 0',
    cursor: 'pointer',
    borderRadius: '4px',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  listaTurnos: {
    marginTop: '20px',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#333',
  },
  turnoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
    marginBottom: '5px',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  turnoItemActivo: {
    backgroundColor: '#e6ffe6',
    fontWeight: 'bold' as const,
  },
  turnoNumero: {
    fontSize: '18px',
  },
  turnoBarberia: {
    fontSize: '14px',
    color: '#666',
  },
  turnoFecha: {
    fontSize: '14px',
    color: '#666',
  },
  turnoHora: {
    fontSize: '14px',
    color: '#666',
    marginLeft: '10px',
  },
};

export default ListaTurnos;