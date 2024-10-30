import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface CortePelo {
  id: number;
  nombre: string;
  imagen: string;
  descripcion: string;
}

const cortesPelo: CortePelo[] = [
  { id: 1, nombre: "Pompadour bajo", imagen: "/assets/imgs/circular/1.png", descripcion: "Volumen peinado hacia atrás con laterales cortos." },
  { id: 2, nombre: "Degradado con barba espesa", imagen: "/assets/imgs/circular/2.jpg", descripcion: "Cabello corto en los laterales con barba gruesa." },
  { id: 3, nombre: "Crew Cut con barba", imagen: "/assets/imgs/circular/3.jpg", descripcion: "Corte militar corto y barba perfilada." },
  { id: 4, nombre: "Corte formal con barba", imagen: "/assets/imgs/circular/4.jpg", descripcion: "Cabello peinado formal con barba cuidada." },
  { id: 5, nombre: "Pompadour con barba", imagen: "/assets/imgs/circular/5.jpg", descripcion: "Volumen en la parte superior y barba bien definida." },
  { id: 6, nombre: "Corte con textura corta", imagen: "/assets/imgs/circular/6.jpg", descripcion: "Cabello corto con textura ligera." },
  { id: 7, nombre: "Texturizado con barba", imagen: "/assets/imgs/circular/7.jpg", descripcion: "Parte superior con textura desordenada y barba completa." },
  { id: 8, nombre: "Corte desordenado con barba", imagen: "/assets/imgs/circular/8.jpg", descripcion: "Textura desordenada en la parte superior con barba espesa." },
  { id: 9, nombre: "Fade bajo con barba", imagen: "/assets/imgs/circular/9.jpg", descripcion: "Degradado suave con barba bien definida." },
  { id: 10, nombre: "Mohawk", imagen: "/assets/imgs/circular/10.jpg", descripcion: "Laterales rapados con una franja de cabello en el centro." },
  { id: 11, nombre: "Buzz Cut con degradado", imagen: "/assets/imgs/circular/11.jpg", descripcion: "Corte militar con un degradado sutil." },
  { id: 12, nombre: "Undercut texturizado", imagen: "/assets/imgs/circular/12.jpg", descripcion: "Parte superior texturizada con laterales rapados." },
  { id: 13, nombre: "Pompadour clásico", imagen: "/assets/imgs/circular/13.jpg", descripcion: "Volumen peinado hacia atrás con un estilo formal." },
  { id: 14, nombre: "Degradado con barba", imagen: "/assets/imgs/circular/14.jpg", descripcion: "Degradado alto con barba densa y definida." },
  { id: 15, nombre: "Flequillo largo con textura", imagen: "/assets/imgs/circular/15.jpg", descripcion: "Flequillo largo y desordenado con laterales cortos" },
  { id: 16, nombre: "Buzz Cut con barba completa", imagen: "/assets/imgs/circular/16.jpg", descripcion: "Corte corto al ras con barba completa." },
  { id: 17, nombre: "Corte con degradado medio", imagen: "/assets/imgs/circular/17.jpg", descripcion: "Degradado suave con barba." },
  { id: 18, nombre: "Corte texturizado con barba espesa", imagen: "/assets/imgs/circular/18.jpg", descripcion: "Cabello corto con textura ligera y barba gruesa." },
  { id: 19, nombre: "French Crop moderno", imagen: "/assets/imgs/circular/19.jpg", descripcion: "flequillo corto y textura en la parte superior." },
  { id: 20, nombre: "Degradado alto con textura", imagen: "/assets/imgs/circular/20.jpg", descripcion: "Parte superior con textura y degradado alto." },
];

const GaleriaCortesPelo: React.FC = () => {
  const [tarjetaVolteada, setTarjetaVolteada] = useState<number | null>(null);
  const navigate = useNavigate();

  const seleccionarCorte = (nombre: string) => {
    localStorage.setItem('corte', nombre);
    navigate('/reserva-turno'); // Reemplaza 'barbero123' con el ID real del barbero
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
    fontSize: '1.8rem',
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