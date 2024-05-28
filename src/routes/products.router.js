import { Router } from 'express';
const productsRouter = Router();
import { ProductManager } from '../productManager.js'; 

const productManager = new ProductManager(); 

// Realizar una ruta que reciba todos los productos y declarar un limite por query new
// Recuperar un producto en especifico 
// Agregar un producto
// actualizar un producto
// eliminar un producto 


//traer todos los productos que tengamos en el archivo products.json y si recibimos un limite traer los productos hasta ese limite

// http;//localhost:8080/products/ -------> si le dejo '/' se queda el endpoint como lo tenemos declarado en index,js es decir /products
// vamos a necesitar utilizar los metodos del productMannger los importamos, esto es asincronico
// la funcion que vamos a recibir va a ser asincronica

productsRouter.get('/', async (req, res) => {

    // lo primero que tenemos que preguntar es tenemos u limite en la peticion
    try {
        // estamos desestructurando todo el objeto query
        const { limit } = req.query
        // vamos a traernor todos los productos utilizando la clase Product Manager
        const products = await productManager.getProducts()

        // si existe un limite aplicamos un slice utilizando el limit como argum
        // del array de productos hacemos un slice y cortamos ese array hasta el limite, es decir todos los productos del 0 al 6 por ej, si 6 es el limit

        if (limit) {
            const limitedProducts = products.slice(0, limit)
            return res.json(limitedProducts)  // transofrmamos a json la respuesta para que pueda ser enviada !
        }

        return res.json(products) // express establetece automaticamente en el header el content type en application/json - lo que indic que el cuerpo de la repsuesta tiene datos json

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al intentar recibir los productos' });
    }

})

// nos traemos todos los productos por id

productsRouter.get('/:pid', async (req, res) => {

    // primeri intentamos obtener este id por los params
    const { pid } = req.params;

    try {
        const products = await productManager.getProductById(pid)
        res.json(products)

    } catch (error) {
        console.log(error)
        res.status(500).send(`error al intetar recibir el producto con id ${pid}`) // 
    }

})


// POST CREATE PRODUCTS

productsRouter.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status = true, category } = req.body;
        // Agregamos el producto y guardamos la respuesta
        const response = await productManager.addProduct({ title, description, price, thumbnail, code, stock, status, category });
        // Enviamos la respuesta como JSON
        res.status(200).json({ message: 'Producto Creado y Almacenado exitosamente', data: response, title, description, price, code, stock, status, category }); // esta linea de codigo se encarga de almacenar el dato en nuestro json

    } catch (error) {
        console.log(error);
        // Si hay un error, enviamos un mensaje de error
        res.status(500).json({ error: 'Error al intentar agregar producto' });
    }

});

// PUT EDITAR PRODUCTO

productsRouter.put('/:pid', async (req, res) => {
    // Intentamos obtener el ID del producto de los parámetros de la solicitud
    const { pid } = req.params;

    try {
        // Extraemos los datos del cuerpo de la solicitud
        const { title, description, price, thumbnail, code, stock, status = true, category } = req.body;

        // Llamamos al método updateProduct con el ID del producto y los nuevos datos
        const response = await productManager.updateProduct(pid, { title, description, price, thumbnail, code, stock, status, category });

        // Respondemos con el producto actualizado
        res.json({ response, message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error('Error al intentar editar el producto:', error);
        res.status(500).send('Error al intentar actualizar el producto');
    }
});


//DELETE

// Eliminar un producto
productsRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        await productManager.deleteProduct(pid);
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error(`Error al intentar eliminar el producto con ID ${pid}:`, error);
        res.status(500).json({ error: `Error al intentar eliminar el producto con ID ${pid}` });
    }
});

//http;//localhost:8080/products/ 


export { productsRouter }