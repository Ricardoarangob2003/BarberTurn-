import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Printer, FileText, ArrowLeft } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import axiosInstance from '../../axiosConfig';

interface Turno {
  id: string;
  hora: string;
  numeroturno: string;
  barberia: string;
  fecha: Date;
}

const barberias = ['Barbafina', 'Barbershop', 'Tucorte', 'Urbanbarber'];

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
});

const TicketPDF = ({ turno }: { turno: Turno }) => (
  <Document>
    <Page size="A6" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>TICKET DE TURNO</Text>
        <Text style={styles.text}>Número: {turno.numeroturno}</Text>
        <Text style={styles.text}>Barbería: {turno.barberia}</Text>
        <Text style={styles.text}>Fecha: {turno.fecha.toLocaleString()}</Text>
        <Text style={styles.text}>Hora: {turno.hora}</Text>
      </View>
    </Page>
  </Document>
);

const TicketImprimible = React.forwardRef<HTMLDivElement, { turno: Turno }>(({ turno }, ref) => (
  <div ref={ref} style={stylesJS.ticketImprimible}>
    <h2 style={stylesJS.ticketTitle}>TICKET DE TURNO</h2>
    <p><strong>Número:</strong> {turno.numeroturno}</p>
    <p><strong>Barbería:</strong> {turno.barberia}</p>
    <p><strong>Fecha:</strong> {turno.fecha.toLocaleString()}</p>
    <p><strong>Hora:</strong> {turno.hora}</p>
  </div>
));

const Turnero: React.FC = () => {
  const [turnoActual, setTurnoActual] = useState<Turno | null>(null);
  const [barberiaSeleccionada, setBarberiaSeleccionada] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const componenteImprimible = useRef<HTMLDivElement>(null);

  const generarTurno = async () => {
    if (!barberiaSeleccionada) {
      setError('Por favor, selecciona una barbería antes de generar un turno.');
      return;
    }
  
    try {
      const letras = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
      const numeros = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
      const nuevoNumeroTurno = `${letras}${numeros}`;
  
      const ahora = new Date();
      const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
      const nuevoTurno: Turno = {
        id: Date.now().toString(),
        numeroturno: nuevoNumeroTurno,
        barberia: barberiaSeleccionada,
        fecha: ahora,
        hora: horaFormateada,
      };
  
      await guardarTurno(nuevoTurno);
  
      setTurnoActual(nuevoTurno);
      setError(null);
    } catch (err) {
      console.error('Error al generar el turno:', err);
      setError('Hubo un error al generar el turno. Por favor, intente nuevamente.');
    }
  };
  
  const guardarTurno = async (turno: Turno) => {
    try {
      await axiosInstance.post('turnero/post', turno);
      console.log('Turno guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el turno:', error);
      throw error;
    }
  };

  const imprimirTicket = useReactToPrint({
    content: () => componenteImprimible.current,
    documentTitle: `Ticket_${turnoActual?.numeroturno || 'Turno'}`,
    onAfterPrint: () => alert('Ticket impreso exitosamente'),
  });

  return (
    <div style={stylesJS.wrapper}>
      <div style={stylesJS.container}>
        <Link to="/" style={stylesJS.backButton}>
          <ArrowLeft size={20} />
          Volver
        </Link>
        <h2 style={stylesJS.title}>Generador de Turnos</h2>
        <div style={stylesJS.selectorContainer}>
          <label htmlFor="barberia-select" style={stylesJS.label}>Selecciona una barbería:</label>
          <select
            id="barberia-select"
            value={barberiaSeleccionada}
            onChange={(e) => setBarberiaSeleccionada(e.target.value)}
            style={stylesJS.select}
          >
            <option value="">--Selecciona una barbería--</option>
            {barberias.map((barberia) => (
              <option key={barberia} value={barberia}>{barberia}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={generarTurno} 
          style={stylesJS.button} 
          aria-label="Generar nuevo turno"
          disabled={!barberiaSeleccionada}
        >
          Generar Turno
        </button>
        {error && <p style={stylesJS.error} role="alert">{error}</p>}
        {turnoActual && (
          <div style={stylesJS.turnoInfo}>
            <h3 style={stylesJS.turnoTitle}>Turno Actual: {turnoActual.numeroturno}</h3>
            <p>Barbería: {turnoActual.barberia}</p>
            <p>Fecha: {turnoActual.fecha.toLocaleString()}</p>
            <button 
              onClick={() => setShowPDFPreview(true)} 
              style={stylesJS.printButton} 
              aria-label="Imprimir"
            >
              <FileText size={20} />
              Imprimir
            </button>
          </div>
        )}
        
        {/* Componente oculto para la impresión */}
        <div style={{ display: 'none' }}>
          {turnoActual && <TicketImprimible ref={componenteImprimible} turno={turnoActual} />}
        </div>

        {/* Modal para mostrar el PDF */}
        {showPDFPreview && turnoActual && (
          <div style={stylesJS.modal}>
            <div style={stylesJS.modalContent}>
              <button style={stylesJS.closeButton} onClick={() => setShowPDFPreview(false)}>
                Cerrar
              </button>
              <PDFViewer width="100%" height="500px">
                <TicketPDF turno={turnoActual} />
              </PDFViewer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const stylesJS = {
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
    padding: '20px',
    maxWidth: '400px',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    color: '#333',
    marginTop: '30px',
  },
  selectorContainer: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontWeight: 'bold' as const,
  },
  select: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center' as const,
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '4px',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  turnoInfo: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  turnoTitle: {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#333',
  },
  error: {
    color: 'red',
    marginTop: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '5px',
    borderRadius: '4px',
  },
  printButton: {
    backgroundColor: '#008CBA',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    borderRadius: '4px',
    margin: '5px 0',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  modal: {
    position: 'fixed' as const,
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '600px',
    position: 'relative' as const,
  },
  closeButton: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  ticketImprimible: {
    textAlign: 'center' as const,
    fontSize: '14px',
    border: '1px solid #ccc',
    padding: '10px',
    marginBottom: '10px',
  },
  ticketTitle: {
    fontSize: '18px',
    marginBottom: '10px',
  },
};

export default Turnero;