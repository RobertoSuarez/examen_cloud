# Desarrollo de un CRUD de Productos

Este proyecto describe el desarrollo de un CRUD de productos que incluye la implementación de un backend, integración con AWS Lambda y S3 para almacenamiento de imágenes, y un frontend para visualizar los productos. A continuación, se describen los pasos y componentes clave de la implementación.

## Descripción del Proyecto

Este proyecto tiene como objetivo proporcionar una solución para gestionar productos, donde se puede crear, leer, actualizar y eliminar productos, además de cargar imágenes asociadas a cada producto mediante el servicio de almacenamiento en la nube AWS S3.

### Componentes del Proyecto:

1. **Base de Datos**:
   - Estructura para almacenar la información de los productos (nombre, descripción, precio, imágenes, etc.).

2. **Backend**:
   - Implementación de la API para manejar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para los productos.

3. **AWS Lambda y S3**:
   - **Lambda**: Función creada en AWS Lambda que se activa cuando se suben imágenes a S3.
   - **S3**: Almacenamiento de imágenes de productos. Las imágenes se cargan en un bucket S3 y se gestionan mediante eventos Lambda.

4. **Frontend**:
   - Desarrollo de la interfaz de usuario que muestra la lista de productos e imágenes.

## Instalación

### 1. Base de Datos

Define la estructura de la base de datos para almacenar los productos. La base de datos debería incluir tablas para los productos y las imágenes asociadas.

### 2. Backend

El backend está desarrollado para manejar las operaciones CRUD de los productos. Asegúrate de configurar el servidor y las rutas necesarias para interactuar con la base de datos y AWS Lambda.

```bash
# Instalación de dependencias
npm install
