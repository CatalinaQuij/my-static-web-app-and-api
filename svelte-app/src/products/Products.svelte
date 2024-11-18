<script>
  import { onMount } from 'svelte';
  import { ListHeader, Modal } from '../components';
  import ProductList from './ProductList.svelte';
  import ProductDetail from './ProductDetail.svelte';
  import { products, addProduct, deleteProduct, updateProduct, setProducts } from '../store';

  let selected = {};
  let routePath = '/products';
  let title = 'Products';
  let productToDelete = null;
  let message = '';
  let showModal = false;

  onMount(async () => await getProducts());

  async function getProducts() {
    try {
      const response = await fetch('/api/products');
      const productsData = await response.json();
      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else {
        throw new Error('Invalid products data');
      }
    } catch (error) {
      console.error(error);
      message = 'Error loading products.';
    }
  }

  function enableAddMode() {
    selected = {};
  }

  function askToDelete({ detail: product }) {
    productToDelete = product;
    showModal = true;
    message = productToDelete?.name ? `Would you like to delete ${productToDelete.name}?` : 'Are you sure?';
  }

  function clear() {
    selected = null;
  }

  function closeModal() {
    showModal = false;
  }

  async function handleDeleteProduct() {
    closeModal();
    if (productToDelete) {
      console.log(`You said you want to delete ${productToDelete.name}`);
      await deleteProduct(productToDelete);
    }
    clear();
  }

  async function save({ detail: product }) {
    console.log('product changed', product);
    if (product.id) {
      await updateProduct(product);
    } else {
      await addProduct(product);
    }
  }

  function select({ detail: product }) {
    selected = product;
    console.log(`selected ${product.name}`);
  }
</script>

<div class="content-container">
  <ListHeader
    {title}
    {routePath}
    on:add={enableAddMode}
    on:refresh={getProducts} />
  
  <div class="columns is-multiline is-variable">
    {#if $products && $products.length > 0}
      <div class="column is-8">
        {#if selected && Object.keys(selected).length > 0}
          <ProductDetail
            product={selected}
            on:unselect={clear}
            on:save={save} />
        {:else}
          <ProductList
            products={$products}
            on:deleted={askToDelete}
            on:selected={select} />
        {/if}
      </div>
    {:else}
      <p>No products available.</p>
    {/if}
  </div>

  <Modal
    {message}
    isOpen={showModal}
    on:handleNo={closeModal}
    on:handleYes={handleDeleteProduct} />
</div>