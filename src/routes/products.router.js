import { Router } from "express";
import ProductManager from "../dao/db/productManager-db.js";

const router = Router();
const prManager = new ProductManager();

router.get("/api/products", async (req, res) => {
    const { limit, category, sort } = req.query;
    try {
        const result = await prManager.getProducts({ limit, category, sort });
        res.send(result);
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/api/products/:pid", async (req, res) => {
    let id = req.params.pid;
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
        const product = await prManager.addProduct(newProduct);
        res.status(201).send({ message: "Producto agregado exitosamente", product });
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
});

router.put('/api/products/:pid', async (req, res) => {
    const pid = req.params.pid;
    const productoActualizado = req.body;
    try {
        await prManager.updateProduct(pid, productoActualizado);
        res.status(200).json({ message: "Producto actualizado exitosamente", data: productoActualizado });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/api/products/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        await prManager.deleteProduct(pid);
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;