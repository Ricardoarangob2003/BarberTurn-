import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface TipoCara {
  id: string;
  nombre: string;
  imagen: string;
  ruta: string;
}

const tiposCara: TipoCara[] = [
  { id: 'cuadrado', nombre: 'Cuadrada', imagen: "/assets/imgs/cuadrado.jpg", ruta: '/cara-tipos/cuadrado-seleccionable' },
  { id: 'ovalado', nombre: 'Ovalada', imagen: '/assets/imgs/ovalado.jpg', ruta: '/cara-tipos/ovalado-seleccionable' },
  { id: 'redondo', nombre: 'Circular', imagen: '/assets/imgs/redondo.jpg', ruta: '/cara-tipos/redondo-seleccionable' },
  { id: 'triangular', nombre: 'Triangular', imagen: '/assets/imgs/triangular.jpg', ruta: '/cara-tipos/triangular-seleccionable' },
];

const GaleriaSeleccionable: React.FC = () => {
  const navigate = useNavigate();

  const handleSeleccion = (nombre: string) => {
    localStorage.setItem('tipoCaraSeleccionado', nombre);
    navigate(`/cortes/${nombre.toLowerCase()}`);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <ArrowLeft size={24} color="white" />
      </button>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>BARBERTURN</h1>
      </header>

      <h1 style={styles.title}>Elige tu Tipo de Cara</h1>

      <div style={styles.gallery}>
        {tiposCara.map((tipo) => (
          <div key={tipo.id} style={styles.card} onClick={() => handleSeleccion(tipo.nombre)}>
            <div style={styles.cardInner}>
              <div style={styles.cardFront}>
                <img src={tipo.imagen} alt={`Imagen de cara tipo ${tipo.nombre}`} style={styles.image} />
              </div>
              <div style={styles.cardBack}>
                <h2 style={styles.cardTitle}>{tipo.nombre}</h2>
                <p style={styles.cardDescription}>Tipo de cara {tipo.nombre.toLowerCase()}</p>
                <button 
                  style={styles.selectButton} 
                  aria-label={`Seleccionar tipo de cara ${tipo.nombre}`}
                >
                  Seleccionar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles using inline objects
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    backgroundImage: 'url("/assets/imgs/background-gallery.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    backgroundColor: '#000',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
    alignItems: 'right',
  },
  title: {
    color: 'white',
    textAlign: 'center',
    margin: '2rem 0',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    padding: '2rem',
  },
  card: {
    perspective: '1500px',
    height: '350px',
    cursor: 'pointer',
  },
  cardInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.8s cubic-bezier(0.6, -0.5, 0.2, 1)',
    transformStyle: 'preserve-3d',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
  },
  cardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    width: '85%',
    height: '90%',
    backfaceVisibility: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    transform: 'rotateY(180deg)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '10px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10px',
    transition: 'transform 0.8s ease-in-out',
  },
  cardTitle: {
    margin: '0',
    fontSize: '24px',
    color: 'white',
  },
  cardDescription: {
    margin: '10px 0',
    color: 'white',
  },
  selectButton: {
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease-in-out',
  },
};

export default GaleriaSeleccionable;