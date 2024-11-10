import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Premium from './components/pages/Premium.tsx';
import Login from './components/pages/Login.tsx';
import Galeria from './components/pages/Galeria.tsx';
import RecuperarContraseña from'./components/pages/RecuperarContraseña.tsx'
import Index from './components/pages/index.tsx';
import Registro from './components/pages/Registro.tsx';
import BarberiasDisponibles from './components/pages/BarberiasDisponibles.tsx';
import BarberosUrbanBarber from './components/pages/BarberosDisponibles-UrbanBarber.tsx';
import ReservaTurno from './components/pages/ReservaTurno.tsx';
import RegistroCredenciales from './components/pages/Registro-Credenciales.tsx';
import DashboardBarbero from './components/pages/dashboard-barbero.tsx';
import GaleriaSeleccionable from './components/pages/GaleriaSeleccionable.tsx';
import Cuadrada from './components/pages/cuadrada.tsx';
import Ovalada from './components/pages/ovalada.tsx';
import Circular from './components/pages/circular.tsx';
import Triangular from './components/pages/triangular.tsx';
import MisTurnos from './components/pages/MisTurnos.tsx';
import Turnero from './components/pages/turnero.tsx';
import TicketTurn from './components/pages/Ticket-turnos.tsx'
import AdminBarber from './components/pages/Admin-Barber.tsx'
import LoginRegister from './components/pages/Login-Register_Barber.tsx'
import PerfilUsuario from './components/pages/Perfil-Usuario.tsx'
import './App.css';
import PerfilBarbero from './components/pages/Perfil-Barbero.tsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/Recuperar-Contraseña" element={<RecuperarContraseña />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Barberias-Disponibles" element={<BarberiasDisponibles />} />
          <Route path="/Barberos-Disponibles/:nombreBarberia" element={<BarberosUrbanBarber />} />
          <Route path="/Reserva-Turno/" element={<ReservaTurno />} />
          <Route path="/Registro-Credenciales" element={<RegistroCredenciales />} />
          <Route path="/Dashboard-Barbero" element={<DashboardBarbero />} />
          <Route path="/Galeria-Seleccionable" element={<GaleriaSeleccionable />} />
          <Route path="/Cortes/Cuadrada" element={<Cuadrada />} />
          <Route path="/Cortes/Ovalada" element={<Ovalada />} />
          <Route path="/Cortes/Circular" element={<Circular />} />
          <Route path="/Cortes/Triangular" element={<Triangular />} />
          <Route path="/Mis-Turnos" element={<MisTurnos />} />
          <Route path="/Turnos" element={<Turnero />} />
          <Route path='/Ticket-Turnos' element={<TicketTurn />} />
          <Route path='/Dashboard-Barberia' element={<AdminBarber />} />
          <Route path='/Iniciar-sesion-Barberia' element={<LoginRegister />} />
          <Route path='/Mi-Perfil' element={<PerfilUsuario />} />
          <Route path='/Perfil-barbero' element={<PerfilBarbero />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;