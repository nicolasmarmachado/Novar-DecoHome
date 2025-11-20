
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group flex flex-col transition-shadow duration-300 hover:shadow-xl">
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-brand-black truncate">{product.name}</h3>
        <p className="text-gray-600 mt-1 text-sm flex-grow min-h-[40px]">{product.description}</p>
        <p className="text-xl font-bold text-brand-black mt-3 self-start">${product.price.toFixed(2)}</p>
        
        <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center">
                <label htmlFor={`quantity-${product.id}`} className="sr-only">Cantidad</label>
                <input
                    type="number"
                    id={`quantity-${product.id}`}
                    name="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-brand-black focus:ring-brand-black sm:text-sm p-2"
                />
            </div>
            <button
            onClick={handleAddToCartClick}
            className="flex-grow bg-brand-black text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-black transition-colors"
            >
            Añadir
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;