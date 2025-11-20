import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutProps {
  cartItems: CartItem[];
  onPlaceOrder: () => void;
  onBackToCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onPlaceOrder, onBackToCart }) => {
  const [formState, setFormState] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 5.00 : 0; // Example shipping cost
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    for (const key in formState) {
        if (formState[key as keyof typeof formState] === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }
    }
    onPlaceOrder();
  };


  return (
    <div className="max-w-4xl mx-auto">
        <button onClick={onBackToCart} className="text-sm font-medium text-brand-black hover:underline mb-4">
            &larr; Volver al carrito
        </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Form Section */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-brand-black mb-6">Información de Pago</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Dirección de Envío</h3>
              <div className="space-y-3">
                <input type="text" name="name" placeholder="Nombre completo" onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-black focus:border-brand-black" required/>
                <input type="text" name="address" placeholder="Dirección" onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-black focus:border-brand-black" required/>
                <div className="flex gap-3">
                    <input type="text" name="city" placeholder="Ciudad" onChange={handleInputChange} className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-brand-black focus:border-brand-black" required/>
                    <input type="text" name="postalCode" placeholder="Código Postal" onChange={handleInputChange} className="w-1/3 border-gray-300 rounded-md shadow-sm focus:ring-brand-black focus:border-brand-black" required/>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Detalles de Pago</h3>
              <div className="space-y-3">
                <input type="text" name="cardNumber" placeholder="Número de Tarjeta" onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-black focus:border-brand-black" required />
                <div className="flex gap-3">
                    <input type="text" name="expiryDate" placeholder="MM/AA" onChange={handleInputChange} className="w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-brand-black focus:border-brand-black" required/>
                    <input type="text" name="cvv" placeholder="CVV" onChange={handleInputChange} className="w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-brand-black focus:border-brand-black" required/>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-brand-black text-white py-3 mt-4 rounded-md shadow-sm hover:bg-gray-800 transition-colors">
              Pagar ${total.toFixed(2)}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg h-fit">
          <h2 className="text-2xl font-bold text-brand-black mb-6">Resumen del Pedido</h2>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.name} className="h-16 w-16 object-cover rounded-md"/>
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
            <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
                <p>Envío</p>
                <p>${shipping.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
