import React from 'react'
import { Link } from 'react-router-dom';
import './Login.css'
export default function Login() {
  return (
    <div class="container-login">
    <h1 class="h1-index">BarberTurn</h1>
    <h2 class="h2-iniciar">Iniciar Sesión</h2>
    <form id="loginForm">
        <div class="form-group-login">
            <input type="text" id="email" name="email" placeholder="Correo" required/>
        </div>
        <div class="form-group-login">
            <input type="password" id="password" name="password" placeholder="Contraseña" required/>
        </div>
        <div class="form-group-login">
        <Link to="/premium" className="btn btn-premium">PREMIUN</Link>
        </div>
        <button type="submit" class="submit-btn-login">Iniciar Sesión</button>
    </form>
    <div class="footer-login">
        © 2024 BarberTurn. Todos los derechos reservados.
    </div>
</div>
  )
}


