import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../axiosConfig';

interface Turno {
  id: string;
  numero: string;
  barberia: string;
  fecha: Date;
}

const ListaTurnos: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [turnoActual, setTurnoActual] = useState<Turno | null>(null);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await axiosInstance.get('/api/turnos');
        setTurnos(response.data);
        if (response.data.length > 0) {
          setTurnoActual(response.data[0]);
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
        // Si es el último turno, volvemos al primero
        setTurnoActual(turnos[0]);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lista de Turnos</h2>
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
              <p style={styles.turnoActualNumero}>{turnoActual.numero}</p>
              <p style={styles.turnoActualInfo}>Barbería: {turnoActual.barberia}</p>
              <p style={styles.turnoActualInfo}>Fecha: {new Date(turnoActual.fecha).toLocaleString()}</p>
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
            <span style={styles.turnoNumero}>{turno.numero}</span>
            <span style={styles.turnoBarberia}>{turno.barberia}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
  },
  title: {
    fontSize: '24px',
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  turnoActualContainer: {
    height: '200px',
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
  },
  listaTurnos: {
    marginTop: '20px',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '10px',
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
};

export default ListaTurnos;