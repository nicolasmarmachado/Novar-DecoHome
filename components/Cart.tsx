import React from 'react';
import { CartItem } from '../types';
import { CloseIcon, TrashIcon, PlusIcon, MinusIcon } from './IconComponents';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onProceedToCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onRemove, onUpdateQuantity, onProceedToCheckout }) => {
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Cart Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-greige shadow-xl z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-heading"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-greige-dark">
                        <h2 id="cart-heading" className="text-xl font-bold text-brand-black">Tu Carrito</h2>
                        <button onClick={onClose} className="p-2 rounded-full text-brand-black hover:bg-greige-dark focus:outline-none focus:ring-2 focus:ring-brand-black" aria-label="Cerrar carrito">
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    {cartItems.length > 0 ? (
                        <div className="flex-grow overflow-y-auto p-4">
                            <ul className="space-y-4">
                                {cartItems.map(item => (
                                    <li key={item.id} className="flex items-start gap-4 bg-white p-3 rounded-lg shadow-sm">
                                        <img src={item.imageUrl} alt={item.name} className="h-20 w-20 object-cover rounded-md" />
                                        <div className="flex-grow">
                                            <h3 className="text-md font-semibold text-brand-black">{item.name}</h3>
                                            <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                    <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1 text-gray-600 hover:bg-gray-100 rounded-l-md" aria-label={`Reducir cantidad de ${item.name}`}><MinusIcon className="h-4 w-4"/></button>
                                                    <span className="px-3 text-sm" aria-live="polite">{item.quantity}</span>
                                                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 text-gray-600 hover:bg-gray-100 rounded-r-md" aria-label={`Aumentar cantidad de ${item.name}`}><PlusIcon className="h-4 w-4"/></button>
                                                </div>
                                                <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-600 p-1" aria-label={`Eliminar ${item.name} del carrito`}>
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-center p-4">
                            <div>
                                <p className="text-gray-600">Tu carrito está vacío.</p>
                                <button onClick={onClose} className="mt-4 text-brand-black font-semibold hover:underline">
                                    Seguir comprando
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Footer */}
                    {cartItems.length > 0 && (
                         <div className="p-4 border-t border-greige-dark bg-white">
                            <div className="flex justify-between items-center mb-4 text-lg font-semibold">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={onProceedToCheckout}
                                className="w-full bg-brand-black text-white py-3 px-4 rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-black transition-colors"
                            >
                                Proceder al pago
                            </button>
                            <div className="mt-4 text-center">
                                <button onClick={onClose} className="text-sm text-gray-600 hover:underline">
                                    o Seguir comprando
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Cart;