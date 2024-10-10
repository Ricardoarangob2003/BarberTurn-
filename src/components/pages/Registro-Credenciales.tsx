import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../../axiosConfig';

interface RegistroData {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  local?: string;
  rol: 'barbero' | 'cliente';
}

interface PasswordStrength {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

export default function RegistroCredenciales() {
  const [registroData, setRegistroData] = useState<RegistroData | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSymbol: false,
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    const storedRol = localStorage.getItem('rol');
  
    if (storedId && storedRol) {
      // Si existen, se establecen los valores de registroData directamente
      setRegistroData({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        local: '',
        rol: storedRol as 'barbero' | 'cliente',  // Establecer el rol
      });
    } else {
      // Redirigir si no se encuentra el ID o rol
      navigate('/registro');
    }
  }, [navigate]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification]);

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const validatePassword = () => {
    return Object.values(passwordStrength).every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      setNotification({
        message: '¡Ups! Tu contraseña no cumple con todos los requisitos de seguridad. Por favor, revisa los criterios y ajústala.',
        type: 'error'
      });
      return;
    }

    if (password !== confirmPassword) {
      setNotification({
        message: '¡Vaya! Las contraseñas no coinciden. ¿Podrías verificarlas de nuevo?',
        type: 'error'
      });
      return;
    }

    const storedUserId = localStorage.getItem('userId');  // Recuperar el ID del usuario
    if (!storedUserId) {
      setNotification({
        message: 'Lo siento, no se encontraron los datos de registro. Por favor, vuelve al paso anterior.',
        type: 'error'
      });
      return;
    }

    try {
      const response = await api.post('/registro-credenciales', {
        userId: storedUserId,  // Incluir el ID del usuario en la solicitud
        username,
        password,
        rol: registroData?.rol  // Incluir el rol en la solicitud
      });

      console.log('Registro exitoso:', response.data);
      localStorage.removeItem('userId');
      localStorage.removeItem('rol');
      setNotification({
        message: '¡Genial! Tu registro se ha completado con éxito. Te estamos redirigiendo al inicio de sesión.',
        type: 'success'
      });

      setTimeout(() => navigate('/iniciar-sesion'), 3000);
    } catch (err) {
      setNotification({
        message: 'Oh no, ha ocurrido un error durante el registro. ¿Podrías intentarlo de nuevo?',
        type: 'error'
      });
    }
  };

  if (!registroData) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>BarberTurn</h1>
        <h2 style={styles.subtitle}>Completar Registro</h2>
        {notification.message && (
          <div style={notification.type === 'error' ? styles.errorNotification : styles.successNotification}>
            {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span>{notification.message}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Nombre de usuario"
              required
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              required
              style={styles.input}
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div style={styles.inputGroup}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              required
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div style={styles.passwordStrength}>
            <p>Tu contraseña debe tener:</p>
            <ul>
              <li style={passwordStrength.hasMinLength ? styles.validCriteria : styles.invalidCriteria}>
                Al menos 8 caracteres
              </li>
              <li style={passwordStrength.hasUppercase ? styles.validCriteria : styles.invalidCriteria}>
                Una letra mayúscula
              </li>
              <li style={passwordStrength.hasLowercase ? styles.validCriteria : styles.invalidCriteria}>
                Una letra minúscula
              </li>
              <li style={passwordStrength.hasNumber ? styles.validCriteria : styles.invalidCriteria}>
                Un número
              </li>
              <li style={passwordStrength.hasSymbol ? styles.validCriteria : styles.invalidCriteria}>
                Un símbolo especial
              </li>
            </ul>
          </div>
          <button type="submit" style={styles.submitButton}>
            Registrarse
          </button>
        </form>
        <div style={styles.footer}>
          © 2024 BarberTurn. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-gallery-tVsfhFLAU6Jg8Wx0HZ0WN8YsxgZbMP.jpg')`,
    backgroundSize: 'cover',
  },
  formContainer: {
    width: '400px',
    padding: '40px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '10px',
    color: 'white',
  },
  title: {
    fontSize: '2.5em',
    textAlign: 'center' as const,
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.5em',
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  inputGroup: {
    position: 'relative' as const,
  },
  input: {
    width: '100%',
    padding: '10px',
    paddingRight: '40px',
    borderRadius: '5px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
  eyeButton: {
    position: 'absolute' as const,
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
  passwordStrength: {
    fontSize: '0.9em',
    color: '#aaa',
  },
  validCriteria: {
    color: '#4CAF50',
  },
  invalidCriteria: {
    color: '#aaa',
  },
  submitButton: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    background: 'white',
    color: 'black',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
  },
  errorNotification: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    border: '1px solid #ff0000',
    borderRadius: '5px',
    marginBottom: '15px',
  },
  successNotification: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    border: '1px solid #00ff00',
    borderRadius: '5px',
    marginBottom: '15px',
  },
  footer: {
    marginTop: '20px',
    fontSize: '0.8em',
    textAlign: 'center' as const,
  },
  loading: {
    color: 'white',
    fontSize: '1.2em',
    textAlign: 'center' as const,
  },
};