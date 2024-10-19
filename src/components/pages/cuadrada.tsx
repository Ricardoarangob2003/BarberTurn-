import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


interface CortePelo {
  id: number;
  nombre: string;
  imagen: string;
  descripcion: string;
}

const cortesPelo: CortePelo[] = [
  { id: 1, nombre: "Undercut con textura", imagen: "/assets/imgs/cuadrado/1.png", descripcion: "Parte superior larga con laterales rapados." },
  { id: 2, nombre: "Pompadour moderno", imagen: "/assets/imgs/cuadrado/2.jpg", descripcion: "Volumen en la parte superior con lados cortos." },
  { id: 3, nombre: "Corte texturizado", imagen: "/assets/imgs/cuadrado/3.jpg", descripcion: "Estilo desordenado con mucha textura." },
  { id: 4, nombre: "Fade alto", imagen: "/assets/imgs/cuadrado/4.jpg", descripcion: "Degradado pronunciado en los lados." },
  { id: 5, nombre: "Corte clásico", imagen: "/assets/imgs/cuadrado/5.png", descripcion: "Estilo tradicional y elegante." },
  { id: 6, nombre: "Mohawk moderno", imagen: "/assets/imgs/cuadrado/6.png", descripcion: "Versión actualizada del mohawk clásico." },
  { id: 7, nombre: "Corte desvanecido", imagen: "/assets/imgs/cuadrado/7.jpg", descripcion: "Transición suave de corto a largo." },
  { id: 8, nombre: "Peinado hacia atrás", imagen: "/assets/imgs/cuadrado/8.jpg", descripcion: "Estilo elegante y sofisticado." },
  { id: 9, nombre: "Corte militar", imagen: "/assets/imgs/cuadrado/9.jpg", descripcion: "Corto y fácil de mantener." },
  { id: 10, nombre: "Flequillo texturizado", imagen: "/assets/imgs/cuadrado/10.jpg", descripcion: "Flequillo con movimiento y textura." },
  { id: 11, nombre: "Corte en capas", imagen: "/assets/imgs/cuadrado/11.jpg", descripcion: "Múltiples longitudes para más volumen." },
  { id: 12, nombre: "Corte francés", imagen: "/assets/imgs/cuadrado/12.jpg", descripcion: "Elegante y con estilo europeo." },
  { id: 13, nombre: "Corte despeinado", imagen: "/assets/imgs/cuadrado/13.jpg", descripcion: "Look casual y desenfadado." },
  { id: 14, nombre: "Corte con líneas", imagen: "/assets/imgs/cuadrado/14.jpg", descripcion: "Diseños geométricos en el cabello." },
  { id: 15, nombre: "Tupé moderno", imagen: "/assets/imgs/cuadrado/15.jpg", descripcion: "Versión actualizada del clásico tupé." },
  { id: 16, nombre: "Corte asimétrico", imagen: "/assets/imgs/cuadrado/16.jpg", descripcion: "Longitudes diferentes a cada lado." },
  { id: 17, nombre: "Corte con flequillo", imagen: "/assets/imgs/cuadrado/17.jpg", descripcion: "Flequillo prominente y estilizado." },
  { id: 18, nombre: "Corte con barba", imagen: "/assets/imgs/cuadrado/18.jpg", descripcion: "Combinación de corte y barba estilizada." },
  { id: 19, nombre: "Corte con rulos", imagen: "/assets/imgs/cuadrado/19.jpg", descripcion: "Realza los rizos naturales." },
  { id: 20, nombre: "Corte con degradado", imagen: "/assets/imgs/cuadrado/20.jpg", descripcion: "Transición suave de largo a corto." },
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