import { promises as fs } from 'fs';

class CartManager {

    constructor(path) {
        this.carts = [];
        this.path = path;
        this.leerArchivo();
    }

    async createCart() {
        const newCart = {
            id: this.getNextId(),
            products: []
        };
        this.carts.push(newCart);
        await this.guardarArchivo(this.carts);
        return newCart;
    }

    async getCartById(id) {

        try {
            const arrayCarts = await this.leerArchivo();
            const carritoBuscado = arrayCarts.find(item => item.id === id);
            if (!carritoBuscado) {
                throw new Error("No existe un carrito con ese id");
            }
            return carritoBuscado;

        } catch (error) {
            console.log("Error al obtener el carrito por ID");
            throw error;
        }
    }

    async addProductInCart(productId, cartId, quantity = 1) {
        try {
            const carritoBuscado = await this.getCartById(cartId);
            const productoAAgregar = carritoBuscado.products.find(item => item.product === productId);
    
            if (productoAAgregar) {
                productoAAgregar.quantity += quantity;
            } else {
                carritoBuscado.products.push({ product: productId, quantity });
            }
            await this.guardarArchivo(this.carts);
    
            return `Producto con ID ${productId} agregado al carrito ${cartId} correctamente.`;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }    

    async getCarts() {
        const arrayCarts = await this.leerArchivo();
        return arrayCarts;
    }

    // Métodos Auxiliares

    async leerArchivo() {
        const respuesta = await fs.readFile(this.path, "utf-8");
        const arrayCarts = JSON.parse(respuesta);
        this.carts = arrayCarts;
        return arrayCarts;
    }

    async guardarArchivo(arrayCarts) {
        await fs.writeFile(this.path, JSON.stringify(arrayCarts, null, 2));
    }    

    getNextId() {
        const maxId = this.carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
        return maxId + 1;
    }
}

export default CartManager;