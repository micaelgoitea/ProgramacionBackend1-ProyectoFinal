const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
});

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    productos.forEach(element => {
        const card = document.createElement("div");
        card.classList.add("col-md-4");
        card.classList.add("p-2")
        card.innerHTML = `<div class="card col" style="width: 18rem;">
                            <img src="${element.thumbnails}" class="card-img-top" alt="...">
                            <div class="card-body">
                            <h5 class="card-title">${element.title}</h5>
                            <p class="card-text">${element.description}</p>
                            <p class="card-text">$${element.price}</p>
                            <a class="btn btn-primary">Eliminar</a>
                            </div>
                          </div>`;
        contenedorProductos.appendChild(card);
        card.querySelector("a").addEventListener("click", () => {
            eliminarProducto(element.id);
        });
    });
};

const eliminarProducto = (id) => {
    console.log(`Eliminando producto con ID: ${id}`);
    socket.emit("eliminarProducto", id);

    socket.once("confirmacionEliminacion", (response) => {
        if (response.status === 'success') {
            console.log(`Producto con ID ${id} eliminado exitosamente`);
            socket.emit("solicitarProductos");
        } else {
            console.error(`Error al eliminar producto con ID ${id}: ${response.error}`);
        }
    });
};

const agregarProducto = () => {
    
    const title = document.getElementById("inputTitle").value;
    const description = document.getElementById("inputDescription").value;
    const code = document.getElementById("inputCode").value;
    const price = document.getElementById("inputPrice").value;
    const stock = document.getElementById("inputStock").value;
    const category = document.getElementById("inputCategory").value;
    const thumbnails = document.getElementById("inputThumbnails").value;

    const nuevoProducto = {
        title: title,
        description: description,
        code: code,
        price: parseFloat(price),
        status: true,
        stock: parseInt(stock),
        category: category,
        thumbnails: thumbnails
    };

    console.log("Enviando nuevo producto:", nuevoProducto);
    
    socket.emit("agregarProducto", nuevoProducto);
    socket.once("confirmacionAgregacion", (response) => {
        if (response.status === 'success') {
            console.log(`Producto agregado exitosamente`);
            socket.emit("solicitarProductos");
        } else {
            console.error(`Error al agregar producto: ${response.error}`);
        }
    });

    document.getElementById("formAgregarProducto").reset();
};

document.addEventListener("DOMContentLoaded", () => {

    const btnAgregarProducto = document.getElementById("btnAgregarProducto");

    btnAgregarProducto.addEventListener("click", (event) => {
        event.preventDefault();
        agregarProducto();
    });
});