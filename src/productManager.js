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

        const id = uuidv4() // genera un id automatico por producto

        // creamos un nuevo producto en una variable y le agregamos todo o que nos pide mas el id unico
        let newProduct = { id, title, description, price, thumbnail, code, stock, status, category }

        this.products = await this.getProducts() // IMPORTANTE igualamos nuestro array vacio a todo lo que tiene nuestro archivo product.json y una vez igualado pusheo el nuevo producto al array

        // a este nuevo producto lo pusheamos al nuevo array de productos que generamos arriba en el constructor
        this.products.push(newProduct)


        // una vez pusheado el producto guardamos el producto
        // hacemos el await del filesystem - VAMOS A UTILIZAR EL WRITEFILE DE FILESYSTEM PARA GUARDAR EL ARCHIVO
        // le pasamos el path y hacemos el stringify del array completo donde van a estar todos los productos, con esot guardamos un producto
        await fs.writeFile(this.path, JSON.stringify(this.products))

    }

    // GET PRODUCTS 

    // esta funcion mas tarde la vamos a reutilizar para obtener productos por id, borrar productos por id e incluso actualizar productos por id 

    getProducts = async () => {

        // vamos a tener una respuesta , le pasamos el path, utf8 lo que hace es parsear la data para que la veamos sin 0 Y 1, 
        const response = await fs.readFile(this.path, 'utf8')

        // una vez que tenemos la respuesta la tenemos que pasar a json

        const responseJSON = JSON.parse(response)

        // retornamos la respuesta
        return responseJSON
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

            // valido si existe un producto y lo retorno
            if (product) {
                return product;
            } else {
                // caso contrario de no existir emito un mensaje
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            // manejo los errores del back
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    //UPDATE PRODUCT


    

    // DELETE PRODUCT
    // vamos a necesitar el indice para removerlo

    deleteProduct = async (id) => {
        // obtengo todos los productos
        const product = await this.getProducts()

        const index = product.findIndex(product => product.id === id)

        if (index !== -1) {

            // si existe el producto  le hacemeos un splice (funcion nativa de js para eliminar) de donde se encuentra el producto, es decir el index  y el valor 1
            // borra en el array de productos todo el producto que se encuentra en el indice que pasemos o que obtenga del find index

            product.splice(index, 1)
            //una vez eliminado le volvemos a sobrescribir el archivo de products.json
            await fs.writeFile(this.path, JSON.stringify(product))

        } else {
            //manejo de errores
            console.log('no se encuentra el producto')
        }

    }



}