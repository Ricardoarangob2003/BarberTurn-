import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Premium from './components/pages/Premium';
import Login from './components/pages/Login.tsx';
import Galeria from './components/pages/Galeria';
import RecuperarContraseña from'./components/pages/RecuperarContraseña.jsx'
import Membresias from './components/pages/Membresias';
import Index from './components/pages/index.tsx';
import Registro from './components/pages/Registro.tsx';
import BarberiasDisponibles from './components/pages/BarberiasDisponibles.tsx';
import Barberosbarbafina from './components/pages/BarberosDisponibles-Barbafina.tsx';
import Barberostucorte from './components/pages/BarberosDisponibles-Tucorte.tsx';
import Barberosbarbershop from './components/pages/BarberosDisponibles-Barbershop.tsx';
import ReservaTurno from './components/pages/ReservaTurno.tsx';
import RegistroCredenciales from './components/pages/Registro-Credenciales.tsx';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="RecuperarContraseña" element={<RecuperarContraseña />} />
          <Route path="/membresias" element={<Membresias />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Barberias-Disponibles" element={<BarberiasDisponibles />} />
          <Route path="/Barberos-Disponibles/barbafina" element={<Barberosbarbafina />} />
          <Route path="/Barberos-Disponibles/tucorte" element={<Barberostucorte />} />
          <Route path="/Barberos-Disponibles/barbershop" element={<Barberosbarbershop />} />
          <Route path="/Reserva-Turno/:barberId" element={<ReservaTurno />} />
          <Route path="/Registro-Credenciales" element={<RegistroCredenciales />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;