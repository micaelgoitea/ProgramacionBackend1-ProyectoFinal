import ProductModel from "../models/product.model.js";

class ProductManager {

    async addProduct({ title, description, code, price, img, stock, category, thumbnails }) {
        try {

            if (!title || !description || !price || !code || !stock || !category) {
                throw new Error("Todos los campos obligatorios deben ser proporcionados.");
            }
            const productoBuscado = await ProductModel.findOne({ code: code });

            if (productoBuscado) {
                throw new Error("Ya existe un producto con el código ingresado.");
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails
            });
            await newProduct.save();

            return newProduct;

        } catch (error) {
            console.log("Error al agregar un producto", error);
            throw error;
        }
    }

    async getProducts({ limit, category, sort } = {}) {
        try {
            const query = {};
            if (category) {
                query.category = category;
            }
    
            const options = {
                limit: limit ? parseInt(limit) : undefined,
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
            };
    
            const result = await ProductModel.paginate(query, options);
            return result;
        } catch (error) {
            console.log("Error al obtener productos", error);
        }
    }

    async getProductById(id) {
        try {
            const productoBuscado = await ProductModel.findById(id);
            if (!productoBuscado) {
                throw new Error(`El producto con el ID ${id} no existe.`);
            }
            return productoBuscado;
        } catch (error) {
            console.log("Error al buscar por ID", error);
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const productoAActualizar = await ProductModel.findByIdAndUpdate(id, productoActualizado);

            if (!productoAActualizar) {
                console.log("No existe el producto que queres actualizar");
                return null;
            }
            return productoAActualizar;
        } catch (error) {
            console.log("Tenemos un error al actualizar productos");
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                console.log("No existe el producto que querés eliminar");
            }
            return deletedProduct;
        } catch (error) {
            console.log("Error al eliminar el producto deseado", error);
        }
    }
}

export default ProductManager;