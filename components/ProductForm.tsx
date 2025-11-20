import React, { useState, useCallback } from 'react';
import { Product } from '../types';
import { generateProductDetails } from '../services/geminiService';
import Spinner from './Spinner';
import { SparklesIcon, ImageIcon } from './IconComponents';

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerateDetails = useCallback(async () => {
    if (!imageFile) {
        setError('Por favor, selecciona una imagen primero.');
        return;
    }
    
    setError(null);
    setIsGenerating(true);

    try {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            const result = await generateProductDetails(base64String, imageFile.type);
            setName(result.name);
            setDescription(result.description);
            setIsGenerating(false);
        };
        reader.onerror = () => {
             throw new Error('No se pudo leer el archivo para la generación con IA.');
        };
    } catch (e) {
        const err = e as Error;
        setError(err.message);
        setIsGenerating(false);
    }
  }, [imageFile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imagePreview) {
        setError('Por favor, completa todos los campos y sube una imagen.');
        return;
    }
    onAddProduct({
      name,
      description,
      price: parseFloat(price),
      imageUrl: imagePreview,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-6">Añadir Nuevo Producto</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
                <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-full">
                    <div className="space-y-1 text-center">
                        {imagePreview ? (
                             <img src={imagePreview} alt="Product preview" className="mx-auto h-40 w-40 object-contain rounded-md" />
                        ) : (
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400"/>
                        )}
                        <div className="flex text-sm text-gray-600">
                        <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-black">
                            <span>Sube un archivo</span>
                            <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-between md:col-span-1">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-black focus:border-brand-black sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-brand-black focus:border-brand-black sm:text-sm" placeholder="0.00" />
                    </div>
                </div>
                <button type="button" onClick={handleGenerateDetails} disabled={isGenerating || !imageFile} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-black disabled:bg-gray-400 disabled:cursor-not-allowed">
                   {isGenerating ? <Spinner /> : <SparklesIcon className="h-5 w-5 mr-2"/>}
                   {isGenerating ? 'Generando...' : 'Generar con IA'}
                </button>
            </div>
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-black focus:border-brand-black sm:text-sm"></textarea>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-black">Cancelar</button>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-black">Añadir Producto</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;