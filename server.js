const { log } = require('console');
const express = require('express');

const { Router } = require('express');
const { appendFile } = require('fs');
const Contenedor = require('./contenedor')


const PORT = 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Servidor escuchando el puerto: ${PORT}`);
})

const contenedorProductos = new Contenedor("productos.txt")


const routerProductos = Router();

//GET  Devuelve todos los productos
routerProductos.get('/', async (req, res) => {
  try {
    const productos = await contenedorProductos.getAll();
    console.log(productos);
    res.send(productos)
  } catch (error) {
    res.send("hubo un error")
  }
})
//POST recibe y agrega un nuevo producto. 
routerProductos.post('/', async (req, res) => {
  const nuevoProducto = req.body;
  const productos = await contenedorProductos.save(nuevoProducto);
  res.json({
    msg: 'Se agrego un nuevo producto.',
    resposne: productos
  })
})

//GET devuelve un producto por ID => http://localhost:8080/productos/1
routerProductos.get("/:id", async (req, res) => {
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
routerProductos.put("/:id", async (req, res) => {
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

routerProductos.delete(":id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
  } catch (error) {
    res.json({
      msg: "Error en el servidor"
    })
  }
})



app.use('/productos', routerProductos);
