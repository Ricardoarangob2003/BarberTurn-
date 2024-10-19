import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Hairstyle {
  id: number;
  image: string;
  title: string;
  description: string;
}

const hairstyles: Hairstyle[] = [
  { id: 1, image: '/assets/imgs/cuadrado/1.png', title: 'Corte Texturizado', description: 'Corte corto con textura y lados desvanecidos.' },
  { id: 2, image: '/assets/imgs/cuadrado/2.jpg', title: 'Buzz Cut con Barba', description: 'Corte muy corto con líneas definidas y barba completa.' },
  { id: 3, image: '/assets/imgs/cuadrado/3.jpg', title: 'Clásico con Raya', description: 'Peinado clásico con raya lateral y lados cortos.' },
  { id: 4, image: '/assets/imgs/cuadrado/4.jpg', title: 'Quiff Voluminoso', description: 'Quiff con volumen y lados degradados con barba completa.' },
  { id: 5, image: '/assets/imgs/cuadrado/5.png', title: 'Quiff Texturizado', description: 'Quiff desordenado con textura y lados cortos.' },
  { id: 6, image: '/assets/imgs/cuadrado/6.png', title: 'Medio Largo Capas', description: 'Cabello medio largo en capas con flequillo lateral.' },
  { id: 7, image: '/assets/imgs/cuadrado/7.jpg', title: 'Corte Deportivo', description: 'Corte corto texturizado con degradado.' },
  { id: 8, image: '/assets/imgs/cuadrado/8.jpg', title: 'Corto con Barba', description: 'Corte corto texturizado con barba completa.' },
];

const HairstyleGallery: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="hairstyle-gallery">
      <header className="header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft />
          <span>Volver</span>
        </button>
        <h1>BarberTurn</h1>
      </header>

      <main className="main-content">
        <h2>Elige tu Estilo de Cabello</h2>

        <div className="gallery-grid">
          {hairstyles.map((style) => (
            <div key={style.id} className="hairstyle-card">
              <div className="image-container">
                <img src={style.image} alt={style.title} />
                <div className="overlay"></div>
              </div>
              <div className="card-content">
                <h3>{style.title}</h3>
                <p>{style.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .hairstyle-gallery {
          font-family: 'Arial', sans-serif;
          background-image: url('/assets/imgs/background-gallery.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          min-height: 100vh;
        }

        .header {
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-button {
          background: none;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 1rem;
        }

        .back-button span {
          margin-left: 0.5rem;
        }

        .main-content {
          padding: 2rem;
          background-color: rgba(255, 255, 255, 0.8);
          margin: 2rem;
          border-radius: 10px;
        }

        h1, h2 {
          margin: 0;
        }

        h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
          color: #333;
        }

        .gallery-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
        }

        .hairstyle-card {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          cursor: default;
          width: 250px;
        }

        .hairstyle-card:hover {
          transform: translateY(-5px);
        }

        .image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .hairstyle-card:hover .image-container img {
          transform: scale(1.1);
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-content {
          padding: 1rem;
        }

        .card-content h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
        }

        .card-content p {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .gallery-grid {
            justify-content: center;
          }
          
          .hairstyle-card {
            width: calc(50% - 1rem);
          }
        }
      `}</style>
    </div>
  );
};

export default HairstyleGallery;
