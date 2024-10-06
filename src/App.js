import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Premium from './components/pages/Premium';
import Login from './components/pages/Login.tsx';
import Galeria from './components/pages/Galeria';
import RecuperarContraseña from'./components/pages/RecuperarContraseña.jsx'
import Membresias from './components/pages/Membresias';
import Index from './components/pages/index.tsx';
import Registro from './components/pages/Registro.tsx';
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;