import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./controllers/productManager.js";

const app = express();
const PUERTO = 8080;
const prManager = new ProductManager("./src/data/products.json");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", viewsRouter);
app.use(express.static("./src/public"));

const server = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto ${PUERTO}`);
});

const io = new Server(server);

io.on("connection", async (socket) => {
    console.log("Cliente conectado");

    socket.emit("productos", await prManager.getProducts());

    socket.on("agregarProducto", async (nuevoProducto) => {
        console.log("Recibido agregarProducto:", nuevoProducto);
        try {
            await prManager.addProduct(nuevoProducto);
            io.emit("productos", await prManager.getProducts());
            socket.emit("confirmacionAgregacion", { status: 'success', nuevoProducto });
        } catch (error) {
            console.error("Error al agregar producto:", error);
            socket.emit("confirmacionAgregacion", { status: 'error', error: error.message });
        }
    });

    socket.on("eliminarProducto", async (id) => {
        console.log(`Recibido eliminarProducto con ID: ${id}`);
        try {
            await prManager.deleteProduct(id);
            io.emit("productos", await prManager.getProducts());
            socket.emit("confirmacionEliminacion", { status: 'success', id });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            socket.emit("confirmacionEliminacion", { status: 'error', error: error.message });
        }
    });
    
    socket.on("solicitarProductos", async () => {
        socket.emit("productos", await prManager.getProducts());
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});