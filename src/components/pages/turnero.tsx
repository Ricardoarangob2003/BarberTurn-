import React from 'react';
import { motion } from 'framer-motion';

const UnderConstruction: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        {/* Fondo con imagen difuminada */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9PPYo6UL7a3WEto3Q3qOdWnIx0MIc0.png')",
          }}
        ></div>
        {/* Capa de superposición */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        {/* Contenido de la página */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Página en Construcción
          </motion.h1>

          <motion.p
            className="text-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Estamos trabajando arduamente para traerte una mejor experiencia.
          </motion.p>

          <motion.div
            className="flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Botón Volver */}
            <motion.button
              className="py-2 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
            >
              Volver
            </motion.button>
          </motion.div>

          {/* Animación para simular construcción */}
          <motion.div
            className="mt-10"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "linear",
            }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-12 h-12 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-9-9 9 9 0 019 9z"
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnderConstruction;
