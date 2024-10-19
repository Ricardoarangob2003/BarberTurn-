import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MembershipTier {
  title: string;
  description: string;
}

const membershipTiers: MembershipTier[] = [
  {
    title: "VIP",
    description: "Disfruta de reservas prioritarias y descuentos exclusivos en tus servicios favoritos. La opción ideal para quienes desean un trato preferente y acceso a promociones únicas.",
  },
  {
    title: "VIP Plus",
    description: "Además de las ventajas de la membresía VIP, obtén servicios adicionales como un corte mensual gratuito y acceso a productos premium con descuentos especiales.",
  },
  {
    title: "Pro",
    description: "Para aquellos que buscan más que solo estilo, la membresía Pro ofrece servicios personalizados, acceso preferente a barberos expertos, y ofertas especiales en tratamientos avanzados.",
  },
  {
    title: "Pro Max",
    description: "Lo mejor de lo mejor. Con la membresía Pro Max, recibirás atención personalizada ilimitada, cortes y arreglos mensuales gratuitos, y acceso completo a todos nuestros servicios premium.",
  }
];

const PremiumMembership: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

      <div style={styles.contentContainer}>
        <header style={styles.header}>
          <motion.button
            style={styles.backButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
          >
            <ArrowLeft style={styles.icon} />
            Volver
          </motion.button>
          <motion.h1
            style={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            BARBERTURN
          </motion.h1>
        </header>

        <motion.h2
          style={styles.mainTitle}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Elige tu Tipo de Membresía
        </motion.h2>

        <div style={styles.membershipsContainer}>
          {membershipTiers.map((tier, index) => (
            <motion.div
              key={tier.title}
              style={styles.membershipCard}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 style={styles.membershipTitle}>{tier.title}</h3>
              <p style={styles.membershipDescription}>{tier.description}</p>
              <motion.button
                style={styles.selectButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Seleccionar
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000',
    backgroundImage: `url('/assets/imgs/background-gallery.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative' as 'relative',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute' as 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  contentContainer: {
    position: 'relative' as 'relative',
    zIndex: 10,
    padding: '0 0 4rem 0',
    margin: '0 auto',
  },
  header: {
    position: 'sticky' as 'sticky',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '0.5rem 2rem',  // Aumentado el padding izquierdo
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  icon: {
    marginRight: '0.5rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold' as 'bold',
    color: '#fff',
    marginRight: '3.8rem',  // Esto empujará el título hacia la izquierda
    paddingLeft: '1rem',  // Añade un poco de espacio entre el botón "Volver" y el título
  },
  mainTitle: {
    fontSize: '3rem',
    fontWeight: 'bold' as 'bold',
    textAlign: 'center' as 'center',
    color: '#fff',
    marginBottom: '3rem',
    marginTop: '1rem',
  },
  membershipsContainer: {
    display: 'flex',
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'center',
    gap: '2rem',
  },
  membershipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '2rem',
    borderRadius: '1rem',
    textAlign: 'center' as 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: 'calc(25% - 1.5rem)',
    minWidth: '250px',
    maxWidth: '300px',
  },
  membershipTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold' as 'bold',
    color: '#000',
    marginBottom: '1rem',
  },
  membershipDescription: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '2rem',
  },
  selectButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold' as 'bold',
  },
};

export default PremiumMembership;