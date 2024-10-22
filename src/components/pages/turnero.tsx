import React, { useState, useRef } from 'react';
import { Printer, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import axiosInstance from '../../axiosConfig';

interface Turno {
  id: string;
  numero: string;
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
        <Text style={styles.text}>Número: {turno.numero}</Text>
        <Text style={styles.text}>Barbería: {turno.barberia}</Text>
        <Text style={styles.text}>Fecha: {turno.fecha.toLocaleString()}</Text>
      </View>
    </Page>
  </Document>
);

const TicketImprimible = React.forwardRef<HTMLDivElement, { turno: Turno }>(({ turno }, ref) => (
  <div ref={ref} style={stylesJS.ticketImprimible}>
    <h2 style={stylesJS.ticketTitle}>TICKET DE TURNO</h2>
    <p><strong>Número:</strong> {turno.numero}</p>
    <p><strong>Barbería:</strong> {turno.barberia}</p>
    <p><strong>Fecha:</strong> {turno.fecha.toLocaleString()}</p>
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

      const nuevoTurno: Turno = {
        id: Date.now().toString(),
        numero: nuevoNumeroTurno,
        barberia: barberiaSeleccionada,
        fecha: new Date(),
      };

      // Guardar el turno en la base de datos
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
      await axiosInstance.post('/api/turnero', turno);
      console.log('Turno guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el turno:', error);
      throw error;
    }
  };

  const imprimirTicket = useReactToPrint({
    content: () => componenteImprimible.current,
    documentTitle: `Ticket_${turnoActual?.numero || 'Turno'}`,
    onAfterPrint: () => alert('Ticket impreso exitosamente'),
  });

  return (
    <div style={stylesJS.container}>
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
          <h3 style={stylesJS.turnoTitle}>Turno Actual: {turnoActual.numero}</h3>
          <p>Barbería: {turnoActual.barberia}</p>
          <p>Fecha: {turnoActual.fecha.toLocaleString()}</p>
          <button 
            onClick={() => setShowPDFPreview(true)} 
            style={stylesJS.printButton} 
            aria-label="Ver PDF"
          >
            <FileText size={20} />
            Ver PDF
          </button>
          <button 
            onClick={imprimirTicket} 
            style={stylesJS.printButton} 
            aria-label="Imprimir ticket"
          >
            <Printer size={20} />
            Imprimir Ticket
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
  );
};

const stylesJS = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  selectorContainer: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
  },
  select: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center' as const,
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '4px',
    width: '100%',
  },
  turnoInfo: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
  },
  turnoTitle: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  printButton: {
    backgroundColor: '#008CBA',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center' as const,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    margin: '10px 0',
    cursor: 'pointer',
    borderRadius: '4px',
    width: '100%',
  },
  ticketImprimible: {
    padding: '20px',
    border: '1px solid #000',
    maxWidth: '300px',
    margin: '0 auto',
  },
  ticketTitle: {
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  modal: {
    position: 'fixed' as const,
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fefefe',
    margin: '15% auto',
    padding: '20px',
    border: '1px solid #888',
    width: '80%',
  },
  closeButton: {
    color: '#aaa',
    float: 'right' as const,
    fontSize: '28px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
  },
};

export default Turnero;