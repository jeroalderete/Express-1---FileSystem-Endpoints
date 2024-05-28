import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Creamos y exportamos una clase en javascript que proporciona la estructura basica , dentro asignamos los metodos del CRUD

export class ProductManager {

    // seteo del path y array vacio de los productos 
    // con el metodo constructor inicializamos la clase, en este caso se ejecuta automaticamente
    constructor() {
        this.path = './src/products.json'
        this.products = []
    }

    // para agregar un producto las condiciones son tener todos esos datos que pedimos en nuestro back -  ({ title, description, price, thumbnail, code, stock, status, category }) 

    addProduct = async ({ title, description, price, thumbnail, code, stock, status, category }) => {
        try {
            const id = uuidv4(); // Genera un id único para el producto

            // Crea un nuevo objeto producto con todos los detalles más el id único
            let newProduct = { id, title, description, price, thumbnail, code, stock, status, category };

            // Obtiene todos los productos actuales
            this.products = await this.getProducts();

            // Agrega el nuevo producto al array de productos
            this.products.push(newProduct);

            // Guarda el array actualizado de productos en el archivo
            await fs.writeFile(this.path, JSON.stringify(this.products));
        } catch (error) {
            // Manejo de errores
            console.error('Error al intentar agregar un producto:', error);
            // Lanza un nuevo error con un mensaje descriptivo
            throw new Error('Error al intentar agregar un producto');
        }
    }

    // GET PRODUCTS 
    // esta funcion mas tarde la vamos a reutilizar para obtener productos por id, borrar productos por id e incluso actualizar productos por id 

    getProducts = async () => {

        try {
            // vamos a tener una respuesta , le pasamos el path, utf8 lo que hace es parsear la data para que la veamos sin 0 Y 1, 
            const response = await fs.readFile(this.path, 'utf8')
            // una vez que tenemos la respuesta la tenemos que pasar a json
            const responseJSON = JSON.parse(response)
            // retornamos la respuesta
            return responseJSON
        } catch (error) {
            console.error('Error al leer los productos', error)
            throw new Error;
        }
    }


    // GETPRODUCT BY ID - SIEMPRE ES ASINCRONICA LA PETICION,  RECIBIMOS UN ID POR PARAMETRO PARA IDENTIFICAR CADA PRODUCTO DE MANERA INDEPENDIENTE

    getProductById = async (id) => {

        try {
            // UTILIZAMOS LA FUNCION GETPRODUCT PORQUE NECESITAMOS TODOS LOS PRODUCTOS DEL JSON PARA BORRAR
            // IMPORTANTE Esperar a que se resuelva la promesa y obtener los productos por eso utilizamos await
            const response = await this.getProducts();

            // Validar si existe un producto cuyo id sea igual al id que recibimos por parámetro
            //validamos si existe un producto cuyo id sea igual a id que recibimos por parametro, lo hacemos utilizando el metodo nativo de JS find
            const product = response.find(product => product.id === id);

            // Valido si no existe el producto tiro un error
            if (!product) {
                // caso contrario de no existir emito un mensaje
                throw new Error('Producto no encontrado');
            }
            // si existe lo retorno
            return product;
        } catch (error) {
            // manejo los errores del back
            console.error('Error al obtener productos:', error);
            // Recomendado utilizar throw new Error para establecer un mensaje personalizado
            throw new Error(`el producto con el id ${id} no existe`);
        }
    }

    //UPDATE PRODUCT
    // recibe el id del producto que queremos modificar y recibe toda la informacion que se va a atualizar por eso usamos el spread operator

    updateProduct = async (id, { ...data }) => {
        try {
            // Obtenemos todos los productos
            const products = await this.getProducts();
    
            // Buscamos el índice del producto con el ID proporcionado
            const index = products.findIndex(product => product.id === id);
    
            // Si se encuentra el producto, actualizamos sus datos
            if (index !== -1) {
                products[index] = { id, ...data };
    
                // Guardamos los productos actualizados en el archivo
                await fs.writeFile(this.path, JSON.stringify(products));
    
                // Retornamos el producto actualizado
                return products[index];
            } else {
                // Si no se encuentra el producto, lanzamos un error
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            // Manejo de errores
            console.error('Error al intentar actualizar el producto:', error);
            // Lanzamos un nuevo error con un mensaje descriptivo
            throw new Error('Error al intentar actualizar el producto');
        }
    }
    

    // DELETE PRODUCT
    // vamos a necesitar el indice para removerlo

    deleteProduct = async (id) => {
        try {
            // Obtengo todos los productos
            const products = await this.getProducts();
    
            // Busco el índice del producto con el ID proporcionado
            const index = products.findIndex(product => product.id === id);
    
            // Si se encuentra el producto, lo eliminamos
            if (index !== -1) {
                // Eliminamos el producto del array de productos
                products.splice(index, 1);
                // Sobrescribimos el archivo de productos con el array actualizado
                await fs.writeFile(this.path, JSON.stringify(products));
            } else {
                // Si no se encuentra el producto, lanzamos un error
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            // Manejo de errores
            console.error('Error al intentar eliminar el producto:', error);
            // Lanzamos un nuevo error con un mensaje descriptivo
            throw new Error('Error al intentar eliminar el producto');
        }
    }
}