import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface CortePelo {
  id: number;
  nombre: string;
  imagen: string;
  descripcion: string;
}

const cortesPelo: CortePelo[] = [
  { id: 1, nombre: "Rasurado completo", imagen: "/assets/imgs/ovalado/1.jpg", descripcion: "Estilo sin cabello, cabeza completamente rapada." },
  { id: 2, nombre: "Buzz Cut con barba", imagen: "/assets/imgs/ovalado/2.jpg", descripcion: "Corte militar muy corto con barba delineada." },
  { id: 3, nombre: "Flequillo recto", imagen: "/assets/imgs/ovalado/3.jpg", descripcion: "Corte con flequillo recto y laterales degradados." },
  { id: 4, nombre: "Classic Ivy League", imagen: "/assets/imgs/ovalado/4.jpg", descripcion: "Estilo clásico con peinado hacia un lado." },
  { id: 5, nombre: "Pompadour lateral", imagen: "/assets/imgs/ovalado/5.jpg", descripcion: "Peinado voluminoso hacia un lado." },
  { id: 6, nombre: "Corte texturizado", imagen: "/assets/imgs/ovalado/6.jpg", descripcion: "Textura ligera en la parte superior." },
  { id: 7, nombre: "Degradado con volumen", imagen: "/assets/imgs/ovalado/7.jpg", descripcion: "Parte superior elevada con degradado bajo." },
  { id: 8, nombre: "Corte elegante con volumen", imagen: "/assets/imgs/ovalado/8.jpg", descripcion: "Estilo clásico y formal." },
  { id: 9, nombre: "Buzz Cut", imagen: "/assets/imgs/ovalado/9.jpg", descripcion: "Corte militar corto sin barba." },
  { id: 10, nombre: "Undercut peinado hacia atrás", imagen: "/assets/imgs/ovalado/10.jpg", descripcion: "Laterales rapados con volumen peinado hacia atrás" },
  { id: 11, nombre: "French Crop", imagen: "/assets/imgs/ovalado/11.jpg", descripcion: "Estilo corto con flequillo y textura." },
  { id: 12, nombre: "Pompadour con degradado", imagen: "/assets/imgs/ovalado/12.jpg", descripcion: "Volumen alto con degradado en los laterales." },
  { id: 13, nombre: "Desordenado con textura", imagen: "/assets/imgs/ovalado/13.jpg", descripcion: "Corte texturizado y despeinado." },
  { id: 14, nombre: "Rizado suelto", imagen: "/assets/imgs/ovalado/14.jpg", descripcion: "Cabello rizado con algo de longitud." },
  { id: 15, nombre: "Corte clásico cepillado", imagen: "/assets/imgs/ovalado/15.jpg", descripcion: "Peinado hacia un lado, estructurado." },
  { id: 16, nombre: "Desordenado con flequillo largo", imagen: "/assets/imgs/ovalado/16.jpg", descripcion: "Textura desordenada y flequillo largo." },
  { id: 17, nombre: "Corte con degradado alto", imagen: "/assets/imgs/ovalado/17.jpg", descripcion: "Parte superior con textura y degradado alto." },
  { id: 18, nombre: "Degradado con barba", imagen: "/assets/imgs/ovalado/18.jpg", descripcion: "Degradado sutil con barba marcada." },
  { id: 19, nombre: "Corte moderno texturizado", imagen: "/assets/imgs/ovalado/19.jpg", descripcion: "Textura moderna en la parte superior con degradado." },
  { id: 20, nombre: "Corte con volumen lateral", imagen: "/assets/imgs/ovalado/20.jpg", descripcion: "Volumen en la parte superior peinado hacia un lado." },
];

const GaleriaCortesPelo: React.FC = () => {
  const [tarjetaVolteada, setTarjetaVolteada] = useState<number | null>(null);
  const navigate = useNavigate();

  const seleccionarCorte = (nombre: string) => {
    localStorage.setItem('corteSeleccionado', nombre);
    navigate('/reserva-turno/'); // Reemplaza 'barbero123' con el ID real del barbero
  };

  const voltearTarjeta = (id: number) => {
    setTarjetaVolteada(tarjetaVolteada === id ? null : id);
  };

  return (
    <div style={estilos.contenedor}>
      <header style={estilos.encabezado}>
        <Link to="/Galeria-Seleccionable" style={estilos.botonVolver}>Volver</Link>
        <h1 style={estilos.titulo}>BARBERTURN</h1>
      </header>

      <h2 style={estilos.subtitulo}>Elige tu Estilo</h2>

      <div style={estilos.galeria}>
        {cortesPelo.map((corte) => (
          <div 
            key={corte.id} 
            style={estilos.tarjeta} 
            onClick={() => voltearTarjeta(corte.id)}
          >
            <div style={{
              ...estilos.tarjetaInterior,
              transform: tarjetaVolteada === corte.id ? 'rotateY(180deg)' : 'rotateY(0)',
            }}>
              <div style={estilos.tarjetaFrente}>
                <img src={corte.imagen} alt={corte.nombre} style={estilos.imagen} />
              </div>
              <div style={estilos.tarjetaReverso}>
                <h3 style={estilos.nombreCorte}>{corte.nombre}</h3>
                <p style={estilos.descripcionCorte}>{corte.descripcion}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    seleccionarCorte(corte.nombre);
                  }}
                  style={estilos.botonSeleccionar}
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

const estilos: { [key: string]: React.CSSProperties } = {
  contenedor: {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-gallery-Q7o6O7FB8cgz1SLHAEc9d2u9QM5Lsr.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  encabezado: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botonVolver: {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    backgroundColor: '#333',
    borderRadius: '5px',
  },
  titulo: {
    margin: 0,
    fontSize: '1.5rem',
  },
  subtitulo: {
    textAlign: 'center',
    color: '#fff',
    margin: '2rem 0',
  },
  galeria: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
    padding: '2rem',
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    perspective: '1000px',
    height: '300px',
    cursor: 'pointer',
  },
  tarjetaInterior: {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
  },
  tarjetaFrente: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  tarjetaReverso: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: '#fff',
    transform: 'rotateY(180deg)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    borderRadius: '10px',
  },
  imagen: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  nombreCorte: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
  },
  descripcionCorte: {
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  botonSeleccionar: {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default GaleriaCortesPelo;