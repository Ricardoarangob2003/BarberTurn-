import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../../axiosConfig';

interface RegistroData {
  id: string;
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
    const storedData = localStorage.getItem('registroTemporal');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (!parsedData.id) {
          throw new Error('ID no encontrado en los datos almacenados');
        }
        setRegistroData(parsedData);
      } catch (error) {
        console.error('Error al parsear los datos del registro:', error);
        setNotification({
          message: 'Error al recuperar los datos del registro. Por favor, vuelve al paso anterior.',
          type: 'error'
        });
        setTimeout(() => navigate('/registro'), 3000);
      }
    } else {
      setNotification({
        message: 'No se encontraron datos del registro. Redirigiendo al inicio del registro.',
        type: 'error'
      });
      setTimeout(() => navigate('/registro'), 3000);
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

    if (!registroData || !registroData.id || !registroData.rol) {
      setNotification({
        message: 'Lo siento, no se encontraron los datos de registro completos. Por favor, vuelve al paso anterior.',
        type: 'error'
      });
      return;
    }

    try {
      const endpoint = registroData.rol === 'barbero' ? '/user/barbero/post' : 'user/cliente/post';
      const response = await api.post(endpoint, {
        ...registroData,
        username,
        password,
      });

      console.log('Registro exitoso:', response.data);
      localStorage.removeItem('registroTemporal');
      setNotification({
        message: '¡Genial! Tu registro se ha completado con éxito. Te estamos redirigiendo al inicio de sesión.',
        type: 'success'
      });

      setTimeout(() => navigate('/iniciar-sesion'), 3000);
    } catch (err) {
      console.error('Error durante el registro:', err);
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
    fontSize: '2.5rem',
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.25rem',
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  inputGroup: {
    position: 'relative' as const,
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  eyeButton: {
    position: 'absolute' as const,
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#ddd',
  },
  passwordStrength: {
    marginBottom: '20px',
  },
  validCriteria: {
    color: 'lightgreen',
  },
  invalidCriteria: {
    color: 'lightcoral',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  errorNotification: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'lightcoral',
    color: 'white',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  successNotification: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'lightgreen',
    color: 'black',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center' as const,
    fontSize: '0.8rem',
  },
  loading: {
    color: 'white',
    fontSize: '1.5rem',
    textAlign: 'center' as const,
  },
};