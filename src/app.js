import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"

const app = express();
const PUERTO = 8080;

app.use(express.json());

app.use("/", productsRouter);

app.use("/", cartsRouter);

app.use(express.static("./src/public"));

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto ${PUERTO}`);
})