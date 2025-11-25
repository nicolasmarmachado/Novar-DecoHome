import { Product } from '../types';

/**
 * Codifica un array de productos a una cadena Base64 segura para URL, manejando correctamente Unicode.
 * @param products El array de productos a codificar.
 * @returns una cadena codificada.
 */
export function encodeProductsForUrl(products: Product[]): string {
  try {
    const jsonString = JSON.stringify(products);
    // Codifica para manejar correctamente los caracteres Unicode antes de la codificación Base64
    const encodedString = btoa(unescape(encodeURIComponent(jsonString)));
    return encodedString;
  } catch (error) {
    console.error("Error encoding products:", error);
    return '';
  }
}

/**
 * Decodifica productos desde el hash de la URL, manejando correctamente Unicode.
 * @returns Un array de productos o null si no hay datos o son inválidos.
 */
export function decodeProductsFromUrl(): Product[] | null {
  try {
    if (window.location.hash && window.location.hash.length > 1) {
      const base64String = window.location.hash.substring(1);
      // Decodifica desde Base64 y luego maneja los caracteres Unicode
      const jsonString = decodeURIComponent(escape(atob(base64String)));
      const products = JSON.parse(jsonString);
      
      // Verificación básica para asegurar que es un array de productos
      if (Array.isArray(products)) {
        return products;
      }
    }
    return null;
  } catch (error) {
    console.error("Error decoding products from URL:", error);
    // Limpia el hash si es inválido para evitar errores en recargas futuras
    window.location.hash = '';
    return null;
  }
}