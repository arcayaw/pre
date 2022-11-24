
const { log } = require("console");
const fs = require("fs");


const date = new Date();
let newDate = date.toLocaleDateString();
let newHour = date.toLocaleTimeString(('en-US'))
const actualDate = (`${newDate} - ${newHour}`)



class ContenedorCarrito {
  constructor(name) {
    this.filename = name;
  }





  /* agregamos prodcuto nuevo */

  async save(cart) {
    try {
      if (fs.existsSync(this.filename)) {
        const carritos = await this.getAll();
        if (carritos.length > 0) {
          //agregar un producto adicional
          const lastId = carritos[carritos.length - 1].id + 1;
          cart.id = lastId;
          carritos.push(cart);
          await fs.promises.writeFile(this.filename, JSON.stringify(carritos, null, 2));
        } else {
          //agregamos un primer producto
          cart.id = 1;
          await fs.promises.writeFile(this.filename, JSON.stringify([cart], null, 2));
        }
      } else {
        cart.id = 1;
        await fs.promises.writeFile(this.filename, JSON.stringify([cart], null, 2));
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
        const carritos = JSON.parse(carritos);
        return carritos;
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
      const carritos = await this.getAll();
      //busca producto por el id
      const carrito = carritos.find(elemento => elemento.id === id);
      return carrito;
    } catch (error) {
      return "El producto no ha sido encontrado";
    }
  }

  //actualizamos producto segun el ID 
  async updateById(id, body) {
    try {
      const carritos = await this.getAll();
      const cartPos = carritos.findIndex(elm => elm.id === id);
      carritos[cartPos] = {
        id: id,
        ...body
      };
      await fs.promises.writeFile(this.filename, JSON.stringify(carritos, null, 2))
      return carritos;
    } catch (error) {
      console.log(error)
    }
  }
  //borramos segun iD
  deleteById = async (id) => {
    try {
      const carritos = await this.getAll();
      const newCart = carritos.filter(item => item.id !== id);
      await fs.promises.writeFile(this.filename, JSON.stringify(newCart, null, 2));
      return `El Carrito con el id ${id} fue elimnado`;
    } catch (error) {
      return "El Carrito NO se a ha podido eliminar"
    }
  }

  getName() {
    return this.filename;
  }
}

module.exports = ContenedorCarrito


const manejadorCarritos = new ContenedorCarrito("carritos.txt");
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