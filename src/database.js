import mongoose from "mongoose";

mongoose.connect("mongodb+srv://micaelgoitea:coderhouse2024@cluster0.2pk1l.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log("Conectados a la BD")).catch(() => console.log("Error en la conexión"))