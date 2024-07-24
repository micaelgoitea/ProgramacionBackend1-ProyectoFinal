import { Router } from "express";
import ProductManager from "../controllers/productManager.js";

const router = Router();
const prManager = new ProductManager("./src/data/products.json");

//Rutas productos:

router.get("/api/products", async (req, res) => {
    let limit = req.query.limit;
    try {
        const arrayOfProducts = await prManager.getProducts();
        if (limit) {
            res.send(arrayOfProducts.slice(0, limit));
        } else {
            res.send(arrayOfProducts);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})

router.get("/api/products/:pid", async (req, res) => {
    let id = parseInt(req.params.pid);

    const product = await prManager.getProductById((id));

    if (!product) {
        res.send("No se encuentra el producto deseado");
    } else {
        res.send({ product })
    }
})

router.post("/api/products", async (req, res) => {
    const newProduct = req.body;
    try {
        await prManager.addProduct(newProduct);
        res.status(201).send({ message: "Producto agregado exitosamente" });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
})

router.put('/api/products/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const updatedFields = req.body;
    try {
        const productoActualizado = await prManager.updateProduct(pid, updatedFields);
        res.json(productoActualizado);
        res.status(201).send({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/api/products/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    try {
        const result = await prManager.deleteProduct(pid);
        res.json({ message: result });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;