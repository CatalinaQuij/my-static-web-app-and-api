import { writable } from 'svelte/store';

const products = writable([]);

const setProducts = (newProducts) => {
  products.set(newProducts);
};

const addProduct = (product) => {
  products.update((currentProducts) => [product, ...currentProducts]);
};

const deleteProduct = (product) => {
  products.update((currentProducts) => 
    currentProducts.filter((v) => v.id !== product.id)
  );
};

const updateProduct = (product) => {
  products.update((currentProducts) => {
    const index = currentProducts.findIndex((v) => v.id === product.id);
    if (index !== -1) {
      currentProducts[index] = product;
    }
    return [...currentProducts]; 
  });
};

export { products, setProducts, addProduct, deleteProduct, updateProduct };