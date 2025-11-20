
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Product, CartItem } from './types';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductForm from './components/ProductForm';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Confirmation from './components/Confirmation';
import { AddIcon } from './components/IconComponents';
import HomeDescription from './components/HomeDescription';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const storedProducts = localStorage.getItem('novar-decohome-products');
      return storedProducts ? JSON.parse(storedProducts) : [];
    } catch (error) {
      console.error("Error reading products from localStorage", error);
      return [];
    }
  });
  
  const [view, setView] = useState<'gallery' | 'form' | 'checkout' | 'confirmation'>('gallery');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('novar-decohome-products', JSON.stringify(products));
    } catch (error) {
      console.error("Error saving products to localStorage", error);
    }
  }, [products]);

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
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
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
    </div>
  );
}