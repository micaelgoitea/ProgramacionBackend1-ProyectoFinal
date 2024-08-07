import { Router } from "express";
import ProductManager from "../controllers/productManager.js";

const router = Router();
const prManager = new ProductManager("./src/data/products.json");

router.get("/products", async (req, res) => {
    try {
        const productos = await prManager.getProducts();
        res.render("home", { productos });
    } catch (error) {
        res.status(500).send("Error al obtener los productos.");
    }
});

router.get("/realtimeproducts", (req,res) => {
    res.render("realtimeproducts");
})

export default router;