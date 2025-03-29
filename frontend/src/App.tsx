import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

// Definir la estructura de un producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  tipoDeProducto: string;
  urlImage: string;
}

function App() {
  // Estado para productos, producto seleccionado y loading
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imagen, setImagen] = useState<File | null>(null);
  
  const apiUrl = 'http://3.84.203.242:3000/products';

  // Función para listar productos
  const listarProductos = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Producto[]>(apiUrl);
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
    setLoading(false);
  };

  // Función para eliminar un producto por ID
  const eliminarProducto = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      listarProductos();  // Volver a listar los productos después de la eliminación
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  // Función para obtener un producto por ID
  const obtenerProducto = async (id: number) => {
    try {
      const response = await axios.get<Producto>(`${apiUrl}/${id}`);
      setProductoSeleccionado(response.data);
    } catch (error) {
      console.error('Error al obtener el producto:', error);
    }
  };

  // Función para manejar la subida de una imagen
  const manejarSubidaImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files ? e.target.files[0] : null;
    if (archivo) {
      setImagen(archivo);
      const formData = new FormData();
      formData.append('image', archivo);

      // Enviar la imagen al backend (asegúrate de que esta ruta exista)
      try {
        await axios.post('http://3.84.203.242:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Imagen subida exitosamente');
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
  };

  // Ejecutar listar productos al cargar el componente
  useEffect(() => {
    listarProductos();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Lista de Productos</h2>
        
        {/* Botón para subir imagen */}
        <label>
          <button 
            style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Subir Imagen
          </button>
          <input
            type="file"
            style={{ display: 'none' }}  // Oculta el input file
            onChange={manejarSubidaImagen}
          />
        </label>
      </div>
      
      {loading ? (
        <p>Cargando...</p>
      ) : (
        productos.map((producto) => (
          <div
            key={producto.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
            }}
          >
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <img 
              src={producto.urlImage} 
              alt={producto.nombre} 
              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} 
            />
            <div>
              <button 
                onClick={() => eliminarProducto(producto.id)} 
                style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px' }}
              >
                Eliminar
              </button>
              <button 
                onClick={() => obtenerProducto(producto.id)} 
                style={{ backgroundColor: 'blue', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '3px', marginLeft: '10px' }}
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))
      )}

      {productoSeleccionado && (
        <div 
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            borderRadius: '5px',
            marginTop: '20px',
          }}
        >
          <h3>Detalles del Producto</h3>
          <p><strong>Nombre:</strong> {productoSeleccionado.nombre}</p>
          <p><strong>Descripción:</strong> {productoSeleccionado.descripcion}</p>
          <p><strong>Tipo:</strong> {productoSeleccionado.tipoDeProducto}</p>
          <p><strong>URL Imagen:</strong> <a href={productoSeleccionado.urlImage} target="_blank" rel="noopener noreferrer">Ver imagen</a></p>
          <img 
            src={productoSeleccionado.urlImage} 
            alt={productoSeleccionado.nombre} 
            style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '5px' }} 
          />
        </div>
      )}
    </div>
  );
}

export default App;
