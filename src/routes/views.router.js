import { Router } from "express";
import ProductModel from "../dao/models/product.model.js";

const router = Router();

router.get("/products", async(req, res) => {
    let page = req.query.page || 1;
    let limit = 4;

    try {
        const listadoProductos = await ProductModel.paginate ({}, {limit, page});

        res.render("home", {
            productos: listadoProductos.docs,
            hasPrevPage: listadoProductos.hasPrevPage,
            hasNextPage: listadoProductos.hasNextPage,
            prevPage: listadoProductos.prevPage,
            nextPage: listadoProductos.nextPage,
            currentPage: listadoProductos.page,
            totalPages: listadoProductos.totalPages
        })

    } catch (error) {
        res.status(500).send ("Error al cargar el listado de productos");
    }
});

router.get("/realtimeproducts", (req,res) => {
    res.render("realtimeproducts");
})

export default router;