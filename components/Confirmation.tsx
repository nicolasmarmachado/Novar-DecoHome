import React from 'react';
import { CheckCircleIcon } from './IconComponents';

interface ConfirmationProps {
  onContinueShopping: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ onContinueShopping }) => {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
      <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-brand-black mb-2">¡Gracias por tu pedido!</h2>
      <p className="text-gray-600 mb-6">
        Tu pedido ha sido realizado con éxito. Recibirás una confirmación por correo electrónico en breve.
      </p>
      <button
        onClick={onContinueShopping}
        className="w-full bg-brand-black text-white py-3 px-4 rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-black transition-colors"
      >
        Seguir comprando
      </button>
    </div>
  );
};

export default Confirmation;
