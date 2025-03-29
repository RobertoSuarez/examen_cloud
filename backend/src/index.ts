import { DataSource } from "typeorm";
import { Product } from "./entity/Product ";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "***",
    ssl: true,
    port: 5432,
    username: "**",
    password: "**",
    database: "**",
    synchronize: true,
    logging: true,
    entities: [Product],
})

const productRepository = AppDataSource.getRepository(Product);

// Inicializar el servidor Express
const app = express();
app.use(bodyParser.json());

// Conectar a la base de datos
AppDataSource.initialize()
    .then(() => {
        console.log("Conexión a la base de datos establecida.");
    })
    .catch((error) => console.log("Error de conexión a la base de datos", error));


// Crear un nuevo producto
app.post("/products", async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, tipoDeProducto, urlImage } = req.body;
        const product = new Product();
        product.nombre = nombre;
        product.descripcion = descripcion;
        product.tipoDeProducto = tipoDeProducto;
        product.urlImage = urlImage;

        const productRepository = AppDataSource.getRepository(Product);
        await productRepository.save(product);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el producto", error });
    }
});


// Obtener todos los productos
app.get("/products", async (req: Request, res: Response) => {
    try {
        const productRepository = AppDataSource.getRepository(Product);
        const products = await productRepository.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos", error });
    }
});


// Obtener un producto por ID
app.get("/products/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id: parseInt(id) } });
    if (!product) {
        res.status(404).json({ message: "Producto no encontrado" });
        return
    }
    res.status(200).json(product);


});


// Actualizar un producto
app.put("/products/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, tipoDeProducto, urlImage } = req.body;
        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOne({ where: { id: parseInt(id) } });

        if (!product) {
            res.status(404).json({ message: "Producto no encontrado" });
            return
        }

        product.nombre = nombre || product.nombre;
        product.descripcion = descripcion || product.descripcion;
        product.tipoDeProducto = tipoDeProducto || product.tipoDeProducto;
        product.urlImage = urlImage || product.urlImage;

        await productRepository.save(product);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error });
    }
});

// Eliminar un producto
app.delete("/products/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOne({ where: { id: parseInt(id) } });

        if (!product) {
            res.status(404).json({ message: "Producto no encontrado" });
            return
        }

        await productRepository.remove(product);
        res.status(204).json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});