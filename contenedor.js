
const fs = require("fs");

let date = new Date();
let newDate = date.toLocaleDateString();
let newHour = date.toLocaleTimeString(('en-US'))
const actualDate = (`${newDate} - ${newHour}`)



class Contenedor {
  constructor(name) {
    this.filename = name;
  }

  /* agregamos prodcuto nuevo */

  async save(product) {
    try {
      if (fs.existsSync(this.filename)) {
        const productos = await this.getAll();
        if (productos.length > 0) {
          //agregar un producto adicional
          const lastId = productos[productos.length - 1].id + 1;
          product.id = lastId;
          productos.push(product);
          await fs.promises.writeFile(this.filename, JSON.stringify(productos, null, 2));
        } else {
          //agregamos un primer producto
          product.id = 1;
          await fs.promises.writeFile(this.filename, JSON.stringify([product], null, 2));
        }
      } else {
        product.id = 1;
        await fs.promises.writeFile(this.filename, JSON.stringify([product], null, 2));
      }
    } catch (error) {
      return "El producto no pudo ser guardado";
    }
  }

  //mostramos todos los producttos
  async getAll() {
    try {
      const contenido = await fs.promises.readFile(this.filename, "utf-8");
      if (contenido.length > 0) {
        const productos = JSON.parse(contenido);
        return productos;
      } else {
        return [];
      }
    } catch (error) {
      return "El archivo no pudo ser leido";
    }
  }

  //mostramos producto segun el id
  async getById(id) {
    try {
      //obtener todos los productos.
      const productos = await this.getAll();
      //busca producto por el id
      const producto = productos.find(elemento => elemento.id === id);
      return producto;
    } catch (error) {
      return "El producto no ha sido encontrado";
    }
  }

  //actualizamos producto segun el ID 
  async updateById(id, body) {
    try {
      const productos = await this.getAll();
      const productPos = productos.findIndex(elm => elm.id === id);
      productos[productPos] = {
        id: id,
        ...body
      };
      await fs.promises.writeFile(this.filename, JSON.stringify(productos, null, 2))
      return productos;
    } catch (error) {
      console.log(error)
    }
  }
  //borramos segun iD
  deleteById = async (id) => {
    try {
      const productos = await this.getAll();
      const newProducts = productos.filter(item => item.id !== id);
      await fs.promises.writeFile(this.filename, JSON.stringify(newProducts, null, 2));
      return `El producto con el id ${id} fue elimnado`;
    } catch (error) {
      return "El elemento NO se a ha podido eliminar"
    }
  }

  getName() {
    return this.filename;
  }
}

module.exports = Contenedor


const manejadorProductos = new Contenedor("productos.txt");
// console.log(manejadorProductos);


//descomentar los metodos para poder probar. 
const getData = async () => {
  //guardamos productos, si el archivo no existe se crea.
  // await manejadorProductos.save(producto1);
  // await manejadorProductos.save(producto2);
  // await manejadorProductos.save(producto3);

  //mostramos todos los productos
  // const productos = await manejadorProductos.getAll();
  // console.log(productos);

  //buscamos el producto que nos pasan por parametro y lo mostramos
  // const productoEncontrado = await manejadorProductos.getById(3);
  // console.log("producto encontrado>", productoEncontrado);

  //borramos el producto asoacido al ID que nos pasan por parametro
  // await manejadorProductos.deleteById(3);
  // console.log(productos);
}
getData();