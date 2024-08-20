import { promises as fs } from 'fs';

class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
        this.leerArchivo();
    }

    async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {

        if (!title || !description || !code || !price || !status || !stock || !category) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error(`Ya existe un producto con el código '${code}'.`);
            return;
        }

        const newProduct = {
            id: this.getNextId(),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails || []
        };

        this.products.push(newProduct);
        await this.guardarArchivo(this.products);
        return newProduct;
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(item => item.id === id);

        if (!product) {
            throw new Error(`El producto con el ID ${id} no existe.`);
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const productoAActualizar = this.products.findIndex(product => product.id === id);

        const productoActualizado = { ...this.products[productoAActualizar] };

        for (let field in updatedFields) {
            if (field !== 'id') {
                productoActualizado[field] = updatedFields[field];
            }
        }
        this.products[productoAActualizar] = productoActualizado;

        await this.guardarArchivo(this.products);

        return productoActualizado;
    }

    async deleteProduct(id) {
        let deletedProduct = null;

        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                deletedProduct = this.products.splice(i, 1)[0];
                await this.guardarArchivo(this.products);
                return `El producto con el ID ${id} ha sido eliminado.`;
            }
        }

        throw new Error(`El producto con el ID ${id} no existe.`);
    }

    // Métodos Auxiliares

    async leerArchivo() {
        const respuesta = await fs.readFile(this.path, "utf-8");
        const arrayOfProducts = JSON.parse(respuesta);
        this.products = arrayOfProducts;
        return arrayOfProducts;
    }

    async guardarArchivo(arrayOfProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayOfProducts, null, 2));
            console.log('Archivo de productos actualizado con éxito.');
        } catch (error) {
            console.error('Error al guardar el archivo de productos:', error);
        }
    }

    getNextId() {
        const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        return maxId + 1;
    }
}

export default ProductManager;