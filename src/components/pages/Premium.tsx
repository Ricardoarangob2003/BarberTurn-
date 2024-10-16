import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

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
  return (
    <div style={styles.container}>
      {/* Fondo oscuro */}
      <div style={styles.overlay}></div>

      {/* Contenido */}
      <div style={styles.contentContainer}>
        {/* Cabecera */}
        <header style={styles.header}>
          <motion.button
            style={styles.backButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft style={styles.icon} />
            Volver
          </motion.button>
          <motion.h1
            style={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => window.history.back()}
          >
            BARBERTURN
          </motion.h1>
        </header>

        {/* Título central */}
        <motion.h2
          style={styles.mainTitle}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Elige tu Tipo de Membresía
        </motion.h2>

        {/* Sección de membresías */}
        <div style={styles.membershipsGrid}>
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

// Estilos en objeto
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
    padding: '4rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
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
    fontSize: '2.5rem',
    fontWeight: 'bold' as 'bold',
    color: '#fff',
  },
  mainTitle: {
    fontSize: '3rem',
    fontWeight: 'bold' as 'bold',
    textAlign: 'center' as 'center',
    color: '#fff',
    marginBottom: '3rem',
  },
  membershipsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '2rem',
    '@media(min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
  membershipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '2rem',
    borderRadius: '1rem',
    textAlign: 'center' as 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
