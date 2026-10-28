import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { FaFileLines, FaLocationDot, FaCloudArrowUp, FaXmark, FaTag } from 'react-icons/fa6';
import { crearRequerimiento, obtenerCategorias } from '../services/requerimientosService';
import { useToast } from '../../../shared/context/ToastContext';
import Encabezado from '../../../shared/components/EncabezadoPagina';
import '../styles/EmitirRequerimientoPage.css';

const LUGARES = [
  'Aula 12', 'Baño Pabellón B', 'Patio', 'Laboratorio 3', 'Dirección',
  'Pasillo principal', 'Biblioteca', 'Gimnasio', 'Cocina', 'Otro',
];

const MAX_DESCRIPCION = 500;

function EmitirRequerimientoPage() {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const inputFileRef = useRef(null);

  // Estado para categorías
  const [categorias, setCategorias] = useState([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  
  // Estado del formulario (fijate que ahora es idCategoria en lugar de titulo)
  const [formData, setFormData] = useState({ idCategoria: '', descripcion: '', lugar: '' });
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [leyendoImagen, setLeyendoImagen] = useState(false);

  // Cargar categorías desde el back al montar
  useEffect(() => {
    obtenerCategorias()
      .then((data) => setCategorias(data))
      .catch((err) => setError('No se pudieron cargar las categorías. ' + err.message))
      .finally(() => setCargandoCategorias(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const aceptarImagen = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes (JPG, PNG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5 MB.');
      return;
    }
    setLeyendoImagen(true);
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setImagen({ archivo: file, url: reader.result, nombre: file.name, peso: file.size });
    };
    reader.onerror = () => { setError('No se pudo leer la imagen seleccionada.'); };
    reader.onloadend = () => { setLeyendoImagen(false); };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => aceptarImagen(e.target.files?.[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); aceptarImagen(e.dataTransfer.files?.[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const quitarImagen = () => { setImagen(null); if (inputFileRef.current) inputFileRef.current.value = ''; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.idCategoria || !formData.descripcion.trim() || !formData.lugar.trim()) {
      setError('Por favor completá los campos obligatorios (*).');
      return;
    }

    setGuardando(true);

    try {
      const creado = await crearRequerimiento({
        idCategoria: Number(formData.idCategoria), // <-- Mandamos el ID de la categoría
        descripcion: formData.descripcion.trim(),
        sector: formData.lugar,
        imagen: imagen?.url ?? null,
      });

      mostrarToast(`Requerimiento REQ-${String(creado.id).padStart(4, '0')} emitido correctamente`, 'success');
      navigate('/gestor/requerimientos/mis-requerimientos');
    } catch (err) {
      setError(err.message || 'No se pudo emitir el requerimiento.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="emitir-requerimiento">
      <Encabezado
        icono={FaFileLines}
        titulo="Emitir requerimiento"
        subtitulo="Completá la información del problema edilicio o de infraestructura."
      />

      {error && <div className="alert alert-danger mb-3" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body p-3 p-md-4">
            <div className="row g-3 mb-3">
              
              {/* CATEGORÍA (Menú desplegable) */}
              <div className="col-12 col-md-6">
                <label className="form-label">Categoría <span className="text-danger">*</span></label>
                <div className="emitir-requerimiento__select-icono">
                  <FaTag className="emitir-requerimiento__select-icono-svg" />
                  <select
                    name="idCategoria"
                    className="form-select"
                    value={formData.idCategoria}
                    onChange={handleChange}
                    disabled={cargandoCategorias}
                  >
                    <option value="">
                      {cargandoCategorias ? 'Cargando categorías...' : 'Seleccioná una categoría'}
                    </option>
                    {categorias.map((cat) => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTOR (Menú desplegable) */}
              <div className="col-12 col-md-6">
                <label className="form-label">Sector <span className="text-danger">*</span></label>
                <div className="emitir-requerimiento__select-icono">
                  <FaLocationDot className="emitir-requerimiento__select-icono-svg" />
                  <select name="lugar" className="form-select" value={formData.lugar} onChange={handleChange}>
                    <option value="">Seleccioná el sector</option>
                    {LUGARES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="mb-0">
              <label className="form-label">Descripción detallada <span className="text-danger">*</span></label>
              <textarea
                name="descripcion"
                className="form-control"
                rows={5}
                placeholder="Describí el problema..."
                value={formData.descripcion}
                onChange={handleChange}
                maxLength={MAX_DESCRIPCION}
              />
              <small className="emitir-requerimiento__contador">
                {formData.descripcion.length}/{MAX_DESCRIPCION}
              </small>
            </div>
          </div>
        </div>

        {/* IMAGEN (igual que antes) */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <label className="form-label mb-3">Agregar imagen (opcional)</label>
            <div className="emitir-requerimiento__imagenes">
              <div
                className={`emitir-requerimiento__dropzone ${dragging ? 'emitir-requerimiento__dropzone--activa' : ''}`}
                onClick={() => inputFileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FaCloudArrowUp size={32} className="emitir-requerimiento__dropzone-icono" />
                <p className="emitir-requerimiento__dropzone-texto">
                  Arrastrá una imagen o <strong>seleccioná un archivo</strong>
                </p>
                <input ref={inputFileRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFileInput} hidden />
              </div>

              {imagen && (
                <div className="emitir-requerimiento__preview">
                  <img src={imagen.url} alt={imagen.nombre} />
                  <button type="button" className="emitir-requerimiento__preview-quitar" onClick={quitarImagen}>
                    <FaXmark size={12} />
                  </button>
                </div>
              )}
            </div>
            {leyendoImagen && <small className="text-muted d-block mt-2">Procesando imagen...</small>}
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button type="button" className="btn btn-light border" onClick={() => navigate(-1)} disabled={guardando}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={guardando || leyendoImagen}>
            {guardando ? 'Emitiendo...' : 'Emitir requerimiento'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmitirRequerimientoPage;