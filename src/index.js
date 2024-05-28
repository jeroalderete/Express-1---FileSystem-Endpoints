import express from 'express'
import { productsRouter } from './routes/products.router.js';

const PORT = 3000

const app = express();

app.use(express.json())

// utilizamos un middleware para crear el endpoint por default de los productos /api/products ! , todo lo que se cree en product.router tendra esa ruta por detras /api/products/ !
app.use('/api/products', productsRouter) 


app.listen(PORT, (req, res) => {
    console.log(`servidor escuchando en el puerto ${PORT}`)
})


