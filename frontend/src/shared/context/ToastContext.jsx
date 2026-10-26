import { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    abierto: false,
    tipo: 'success',
    mensaje: '',
  });

  function mostrarToast(mensaje, tipo = 'success') {
    setToast({ abierto: true, tipo, mensaje });
  }

  function cerrarToast() {
    setToast((prev) => ({ ...prev, abierto: false }));
  }

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <Toast
        abierto={toast.abierto}
        tipo={toast.tipo}
        mensaje={toast.mensaje}
        onCerrar={cerrarToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
}