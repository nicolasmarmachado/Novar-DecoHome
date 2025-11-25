
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Product, CartItem } from './types';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductForm from './components/ProductForm';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Confirmation from './components/Confirmation';
import { AddIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from './components/IconComponents';
import HomeDescription from './components/HomeDescription';
import { initialProducts } from './data/initialProducts';
import { encodeProductsForUrl, decodeProductsFromUrl } from './services/urlService';

const APP_PRODUCTS_KEY = 'novar-decohome-products';

// Function to initialize products state
const initializeProducts = (): Product[] => {
  // 1. Prioritize products from URL hash
  const productsFromUrl = decodeProductsFromUrl();
  if (productsFromUrl) {
    // If we load from the URL, also update localStorage for persistence on refresh
    try {
      localStorage.setItem(APP_PRODUCTS_KEY, JSON.stringify(productsFromUrl));
    } catch (error) {
      console.error("Error saving URL products to localStorage:", error);
    }
    return productsFromUrl;
  }

  // 2. Fallback to localStorage
  try {
    const storedProducts = localStorage.getItem(APP_PRODUCTS_KEY);
    if (storedProducts) {
      return JSON.parse(storedProducts);
    }
  } catch (error) {
    console.error("Error loading products from localStorage:", error);
  }

  // 3. Fallback to initial products for first-time visitors
  try {
    localStorage.setItem(APP_PRODUCTS_KEY, JSON.stringify(initialProducts));
  } catch (error) {
    console.error("Error saving initial products to localStorage:", error);
  }
  return initialProducts;
};


export default function App() {
  const [products, setProducts] = useState<Product[]>(initializeProducts);
  
  const [view, setView] = useState<'gallery' | 'form' | 'checkout' | 'confirmation'>('gallery');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(APP_PRODUCTS_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Error saving products to localStorage", error);
    }
  }, [products]);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const addProduct = useCallback((newProduct: Omit<Product, 'id'>) => {
    setProducts(prevProducts => [
      { ...newProduct, id: new Date().toISOString() },
      ...prevProducts,
    ]);
    setView('gallery');
  }, []);

  const handleCancel = useCallback(() => {
    setView('gallery');
  }, []);

  const handleAddToCart = useCallback((product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const handleRemoveFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [handleRemoveFromCart]);
  
  const handleProceedToCheckout = useCallback(() => {
    setIsCartOpen(false);
    setView('checkout');
  }, []);

  const handleBackToCart = useCallback(() => {
    setView('gallery');
    setIsCartOpen(true);
  }, []);

  const handlePlaceOrder = useCallback(() => {
    setCart([]);
    setView('confirmation');
  }, []);
  
  const handleContinueShopping = useCallback(() => {
    setView('gallery');
  }, []);

  const handleShare = useCallback(() => {
    const encodedData = encodeProductsForUrl(products);
    const shareableLink = `${window.location.origin}${window.location.pathname}#${encodedData}`;
    
    navigator.clipboard.writeText(shareableLink).then(() => {
      setShareFeedback('¡Enlace copiado!');
      setTimeout(() => setShareFeedback(''), 2000);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      setShareFeedback('Error al copiar');
      setTimeout(() => setShareFeedback(''), 2000);
    });
  }, [products]);


  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const renderContent = () => {
    switch (view) {
      case 'form':
        return <ProductForm onAddProduct={addProduct} onCancel={handleCancel} />;
      case 'checkout':
        return <Checkout cartItems={cart} onPlaceOrder={handlePlaceOrder} onBackToCart={handleBackToCart} />;
      case 'confirmation':
        return <Confirmation onContinueShopping={handleContinueShopping} />;
      case 'gallery':
      default:
        return (
          <>
            <HomeDescription />
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-4">
                <h2 className="text-2xl font-semibold text-gray-800">Tu galería de productos está vacía</h2>
                <p className="mt-4 text-gray-600">
                  Parece que aún no has añadido ningún producto.
                </p>
                <p className="mt-2 text-gray-600">
                  ¡Haz clic en el botón <span className="font-bold text-brand-black">+</span> de abajo para empezar!
                </p>
              </div>
            )}
            <button
              onClick={() => setView('form')}
              className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 bg-brand-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-greige focus:ring-brand-black transition-transform transform hover:scale-105"
              aria-label="Añadir nuevo producto"
            >
              <AddIcon className="h-6 w-6" />
            </button>
          </>
        );
    }
  };


  return (
    <div className="min-h-screen bg-greige text-brand-black font-sans">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)}
        onShare={handleShare}
        shareFeedback={shareFeedback}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onProceedToCheckout={handleProceedToCheckout}
      />
      
      {/* ¡CAMBIA ESTE ENLACE por un enlace directo a un archivo .mp3! */}
      <audio
        ref={audioRef}
        src="https://www.udio.com/songs/iVAXRPfkDba6iZeTZbwtBD?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        // @ts-ignore - volume is a valid attribute
        volume="0.2"
      ></audio>

      <button
        onClick={togglePlay}
        className="fixed bottom-6 left-6 lg:bottom-8 lg:left-8 bg-brand-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-greige focus:ring-brand-black transition-transform transform hover:scale-105 z-20"
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
      >
        {isPlaying ? (
          <SpeakerWaveIcon className="h-5 w-5" />
        ) : (
          <SpeakerXMarkIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
