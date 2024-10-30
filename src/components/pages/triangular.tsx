import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface CortePelo {
  id: number;
  nombre: string;
  imagen: string;
  descripcion: string;
}

const cortesPelo: CortePelo[] = [
  { id: 1, nombre: "Buzz Cut", imagen: "/assets/imgs/triangular/1.jpeg", descripcion: "Corte rapado, simple y bajo con líneas definidas." },
  { id: 2, nombre: "Taper Fade Afro", imagen: "/assets/imgs/triangular/2.jpg", descripcion: "Desvanecido gradual con textura afro y forma definida." },
  { id: 3, nombre: "Textured Fringe", imagen: "/assets/imgs/triangular/3.jpg", descripcion: "Flequillo texturizado con puntas desordenadas y lados cortos." },
  { id: 4, nombre: "French Crop", imagen: "/assets/imgs/triangular/4.jpg", descripcion: "Corte corto con flequillo recto y textura arriba." },
  { id: 5, nombre: "Crew Cut", imagen: "/assets/imgs/triangular/5.jpg", descripcion: "Corte corto con un pequeño desvanecido en los lados." },
  { id: 6, nombre: "Textured Quiff", imagen: "/assets/imgs/triangular/6.jpg", descripcion: "Quiff voluminoso con textura arriba y laterales cortos." },
  { id: 7, nombre: "Low Fade", imagen: "/assets/imgs/triangular/7.jpg", descripcion: "Corte bajo con desvanecido gradual en los laterales." },
  { id: 8, nombre: "High Skin Fade", imagen: "/assets/imgs/triangular/8.jpg", descripcion: "Desvanecido alto con rapado al ras en los lados." },
  { id: 9, nombre: "Comb Over Fade", imagen: "/assets/imgs/triangular/9.jpg", descripcion: "Lado peinado hacia un costado con desvanecido suave" },
  { id: 10, nombre: "High Top Fade", imagen: "/assets/imgs/triangular/10.jpg", descripcion: "arte superior alta con desvanecido bajo." },
  { id: 11, nombre: "Skin Fade con barba", imagen: "/assets/imgs/triangular/11.jpg", descripcion: "Desvanecido bajo con líneas definidas y barba conectada." },
  { id: 12, nombre: "High Fade", imagen: "/assets/imgs/triangular/12.jpg", descripcion: "Desvanecido alto con cabello más largo en la parte superior." },
  { id: 13, nombre: "Pompadour", imagen: "/assets/imgs/triangular/13.jpg", descripcion: "Volumen alto peinado hacia atrás, desvanecido en los lados." },
  { id: 14, nombre: "Wavy Crop:", imagen: "/assets/imgs/triangular/14.jpg", descripcion: "Corte corto con textura ondulada y desvanecido bajo." },
  { id: 15, nombre: "Buzz Cut Fade", imagen: "/assets/imgs/triangular/15.jpg", descripcion: "Rapado al ras con desvanecido gradual." },
  { id: 16, nombre: "Curly Fade", imagen: "/assets/imgs/triangular/16.jpg", descripcion: "Rizos definidos con desvanecido bajo." },
  { id: 17, nombre: "Caesar Cut", imagen: "/assets/imgs/triangular/17.jpg", descripcion: "Corte corto con flequillo recto, textura sutil." },
  { id: 18, nombre: "Curly Taper Fade", imagen: "/assets/imgs/triangular/18.jpg", descripcion: "Rizos definidos con un desvanecido gradual." },
  { id: 19, nombre: "Skin Fade Short Crop", imagen: "/assets/imgs/triangular/19.jpg", descripcion: "Corte corto con desvanecido al ras en los lados." },
  { id: 20, nombre: "Crew Cut Fade", imagen: "/assets/imgs/triangular/20.jpg", descripcion: "Corte crew con un leve desvanecido." },
];

const GaleriaCortesPelo: React.FC = () => {
  const [tarjetaVolteada, setTarjetaVolteada] = useState<number | null>(null);
  const navigate = useNavigate();

  const seleccionarCorte = (nombre: string) => {
    localStorage.setItem('corte', nombre);
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