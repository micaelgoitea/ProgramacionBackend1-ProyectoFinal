import { Router } from "express";
import CartManager from "../dao/db/cartManager-db.js";

const router = Router();
const crtManager = new CartManager();

router.post("/api/carts", async (req, res) => {
    try {
        const newCart = await crtManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
})

router.get("/api/carts/:cid", async (req, res) => {
    const id = req.params.cid;
    try {
        const cart = await crtManager.getCartById(id);

        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.json(cart.products);
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

router.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const newCart = await crtManager.addProductInCart(productoId, carritoId, quantity);
        res.json(newCart.products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/api/carts", async (req, res) => {
    try {
        const carts = await crtManager.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).send({ error: "Error al obtener los carritos" });
    }
});

router.put("/api/carts/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {

        if (quantity === undefined || quantity <= 0) {
            return res.status(400).send({ error: "La cantidad debe ser un número mayor a 0" });
        }
        const updatedCart = await crtManager.updateProductQuantityInCart(cid, pid, quantity);
        res.status(200).send(updatedCart);

    } catch (error) {
        res.status(500).send({ error: "Error al actualizar la cantidad del producto en el carrito" });
    }
});

router.delete("/api/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const carritoVacio = await crtManager.emptyCart(cid);
        res.status(200).send(carritoVacio);
    } catch (error) {
        res.status(500).send({ error: "Error al vaciar el carrito" });
    }
});

router.delete("/api/carts/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await crtManager.removeProductFromCart(cid, pid);
        res.status(200).send(updatedCart);
    } catch (error) {
        res.status(500).send({ error: "Error al eliminar el producto deseado del carrito" });
    }
});

export default router;