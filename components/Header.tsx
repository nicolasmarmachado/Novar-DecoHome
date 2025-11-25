import React from 'react';
import { CartIcon, ShareIcon } from './IconComponents';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onShare: () => void;
  shareFeedback: string;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onShare, shareFeedback }) => {
  return (
    <header className="bg-greige-dark shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
              <button 
                  onClick={onShare}
                  className="relative p-2 rounded-full text-brand-black hover:bg-greige focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-greige-dark focus:ring-brand-black"
                  aria-label="Compartir galería"
              >
                  <ShareIcon className="h-6 w-6" />
              </button>
              {shareFeedback && (
                  <span className="text-sm text-brand-black transition-opacity duration-300">{shareFeedback}</span>
              )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-brand-black text-center absolute left-1/2 -translate-x-1/2">
            Novar DecoHome
          </h1>
          
          <button 
            onClick={onCartClick} 
            className="relative p-2 rounded-full text-brand-black hover:bg-greige focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-greige-dark focus:ring-brand-black"
            aria-label={`Ver carrito con ${cartCount} artículos`}
          >
            <CartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
