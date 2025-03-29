"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./entity/Product ");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "ep-yellow-field-a5bale36-pooler.us-east-2.aws.neon.tech",
    ssl: true,
    port: 5432,
    username: "examen_owner",
    password: "npg_HQkDKNR3S6IM",
    database: "examen",
    synchronize: true,
    logging: true,
    entities: [Product_1.Product],
});
const productRepository = exports.AppDataSource.getRepository(Product_1.Product);
// Inicializar el servidor Express
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// Conectar a la base de datos
exports.AppDataSource.initialize()
    .then(() => {
    console.log("Conexión a la base de datos establecida.");
})
    .catch((error) => console.log("Error de conexión a la base de datos", error));
// Crear un nuevo producto
app.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion, tipoDeProducto, urlImage } = req.body;
        const product = new Product_1.Product();
        product.nombre = nombre;
        product.descripcion = descripcion;
        product.tipoDeProducto = tipoDeProducto;
        product.urlImage = urlImage;
        const productRepository = exports.AppDataSource.getRepository(Product_1.Product);
        yield productRepository.save(product);
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error al crear el producto", error });
    }
}));
// Obtener todos los productos
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productRepository = exports.AppDataSource.getRepository(Product_1.Product);
        const products = yield productRepository.find();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener los productos", error });
    }
}));
// Obtener un producto por ID
app.get("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const productRepository = exports.AppDataSource.getRepository(Product_1.Product);
    const product = yield productRepository.findOne({ where: { id: parseInt(id) } });
    if (!product) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
    }
    res.status(200).json(product);
}));
// Actualizar un producto
app.put("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombre, descripcion, tipoDeProducto, urlImage } = req.body;
        const productRepository = exports.AppDataSource.getRepository(Product_1.Product);
        const product = yield productRepository.findOne({ where: { id: parseInt(id) } });
        if (!product) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        product.nombre = nombre || product.nombre;
        product.descripcion = descripcion || product.descripcion;
        product.tipoDeProducto = tipoDeProducto || product.tipoDeProducto;
        product.urlImage = urlImage || product.urlImage;
        yield productRepository.save(product);
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error });
    }
}));
// Eliminar un producto
app.delete("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productRepository = exports.AppDataSource.getRepository(Product_1.Product);
        const product = yield productRepository.findOne({ where: { id: parseInt(id) } });
        if (!product) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        yield productRepository.remove(product);
        res.status(204).json({ message: "Producto eliminado" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error });
    }
}));
// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
