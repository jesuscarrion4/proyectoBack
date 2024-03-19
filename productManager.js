const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar el archivo de productos:", error);
    }
  }

  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error("Error al guardar el archivo de productos:", error);
    }
  }

  async addProduct(productData) {
    try {
      const id = this.generateUniqueId();
      const newProduct = { id, ...productData };
      this.products.push(newProduct);
      await this.saveProducts();
      return newProduct;
    } catch (error) {
      console.error("Error al agregar un producto:", error);
      return null;
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(product => product.id === id) || null;
  }

  async updateProduct(id, updatedFields) {
    try {
      const index = this.products.findIndex(product => product.id === id);
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...updatedFields };
        await this.saveProducts();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return false;
    }
  }

  async deleteProduct(id) {
    try {
      const index = this.products.findIndex(product => product.id === id);
      if (index !== -1) {
        this.products.splice(index, 1);
        await this.saveProducts();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return false;
    }
  }

  generateUniqueId() {
    return this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
  }
}

// Ejemplo de uso:
(async () => {
  const productManager = new ProductManager('productos.json');

  await productManager.addProduct({
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100,
    thumbnail: 'ruta/imagen1.jpg',
    code: 'ABC123',
    stock: 10
  });

  console.log(productManager.getProducts());

  await productManager.updateProduct(1, { stock: 15 });
  console.log(productManager.getProducts());

  await productManager.deleteProduct(1);
  console.log(productManager.getProducts());
})();
