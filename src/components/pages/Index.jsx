import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Phone } from 'lucide-react'; // Asegúrate de tener instalada la librería 'lucide-react'

export default function Register() {
  return (
    <div
      className="button-grid"
      style={{
        backgroundImage: 'url("/assets/imgs/background-gallery.jpg")', // Cambia esto por la ruta de tu imagen
        backgroundSize: 'cover', // Para cubrir todo el contenedor
        backgroundPosition: 'center', // Para centrar la imagen
        height: '100vh', // Ajusta la altura según lo necesites
        display: 'flex', // Para centrar el contenido
        alignItems: 'center', // Alinea verticalmente
        justifyContent: 'center', // Alinea horizontalmente
        flexDirection: 'column', // Para organizar el contenido en columna
      }}
    >
      <div className="button-grid">
        <Link to="/premium" className='btn btn-premium'>Premium</Link>
        <Link to="/iniciar-sesion" className="btn">INICIAR</Link>
        <Link to="/galeria" className="btn">GALERIA</Link>
        <Link to="/barberias-disponibles" className="btn">TURNOS</Link>
      </div>

      {/* Footer */}
      <div className="footer-index" style={{ marginTop: 'auto', padding: '20px', textAlign: 'center', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <a 
            href="https://www.instagram.com" 
            className="social-icon" 
            aria-label="Instagram" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Instagram />
          </a>

          <a 
            href="https://www.youtube.com" 
            className="social-icon" 
            aria-label="YouTube" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Youtube />
          </a>

          <a 
            href="https://whatsapp.com" 
            className="social-icon" 
            aria-label="Llamar"
            target="_blank"
            rel='noopener noreferrer'
          >
            <Phone />
          </a>
        </div>
      </div>
    </div>
  );
}
