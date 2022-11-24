
const express = require('express');

const { Router } = require('express');

const Contenedor = require('./contenedor')
const ContenedorCarrito = require("./contenedorCarrito")



const PORT = process.env.PORT || 8080;

const app = express();

app.use((req, res, next) => {
  console.log("procesando antes de la peticion");
  next();
})

/* 
-Verifico el rol para dar acceso a las Rutas.
 -Admin puede acceder a todo
*/
let rol = "admin"
const verificarRol = (req, res, next) => {
  if (rol === "admin") {
    next();
  } else {
    res.send("no tienes acceso a esta ruta")
  }
}

let date = new Date();
let newDate = date.toLocaleDateString();
let newHour = date.toLocaleTimeString(('en-US'))
const actualDate = (`${newDate} - ${newHour}`)


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Servidor escuchando el puerto: ${PORT}`);
})

const contenedorProductos = new Contenedor("productos.txt")
const contenedorCarritos = new ContenedorCarrito("carritos.txt")

const routerProductos = Router();
const routerCarritos = Router()

//GET  Devuelve todos los productos
routerProductos.get('/', async (req, res) => {
  try {
    const productos = await contenedorProductos.getAll();
    console.log(productos);
    res.send(productos)
  } catch (error) {
    res.status(500).send("hubo un error")
  }
})

//GET devuelve un producto por ID => http://localhost:8080/productos/1
routerProductos.get("/:id", verificarRol, async (req, res) => {
  const { id } = req.params;
  const producto = await contenedorProductos.getById(parseInt(id));
  console.log(producto);
  if (producto) {
    res.json({
      msg: "producto encontrado",
      producto: producto
    })
  } else {
    res.json({
      msg: "no se encontro el producto solicitado"
    })
  }
})

//PUT recibe un producto y modifica el contenido 
routerProductos.put("/:id", verificarRol, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    console.log(id);
    const productoAcutlizado = await contenedorProductos.updateById(parseInt(id), update)
    // console.log(id);
    res.json({
      msg: `El producto con id ${id} ha sido actualizado`,
      response: productoAcutlizado
    })
  } catch (error) {

  }
})

//POST recibe y agrega un nuevo producto. 
routerProductos.post('/', verificarRol, async (req, res) => {
  const nuevoProducto = req.body;
  const productos = await contenedorProductos.save(nuevoProducto);
  res.json({
    msg: 'Se agrego un nuevo producto.',
    resposne: productos,
    timestamp: actualDate
  })
})



//Borra un producto segun ID 
routerProductos.delete("/:id", verificarRol, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
  } catch (error) {
    res.json({
      msg: "Error en el servidor"
    })
  }
})

/* Carrito */

routerCarritos.get("/:id/productos", async (req, res) => {
  const { id } = req.params;
  const carrito = await contenedorCarritos.getById(parseInt(id));
  console.log(carrito);
  if (carrito) {
    res.json({
      msg: "producto encontrado",
      carrito: carrito

    })
  } else {
    res.json({
      msg: "no se encontro el producto solicitado"
    })
  }
  console.log(carrito);
})



routerCarritos.post('/carrito', async (req, res) => {
  const nuevoCarrito = req.body;
  const carritos = await contenedorProductos.save(nuevoCarrito)
  res.json({
    msg: "se agrego un nuevo carrito",
    response: carritos
  })
})


app.use('/productos', routerProductos);
app.use("/carritos", routerCarritos)


