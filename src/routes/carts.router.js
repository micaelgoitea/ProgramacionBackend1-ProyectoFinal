import { Router } from "express";
import CartManager from "../controllers/cartManager.js";

const router = Router();
const crtManager = new CartManager("./src/data/carts.json");

//Rutas carritos:

router.post("/api/carts", async (req, res) => {
    try {
        const newCart = await crtManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
})

router.get("/api/carts/:cid", async (req, res) => {
    let id = parseInt(req.params.cid);

    try {

        const cart = await crtManager.getCartById((id));
        res.json(cart.products);

    } catch (error) {

        res.status(500).send({ status: "error", message: error.message });

    }
})

router.post('/api/:cid/product/:pid', async (req, res) => {
    const carritoId = parseInt(req.params.cid);
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
    let limit = req.query.limit;
    try {
        const arrayOfCarts = await crtManager.getCarts();
        if (limit) {
            res.send(arrayOfCarts.slice(0, limit));
        } else {
            res.send(arrayOfCarts);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})

export default router;