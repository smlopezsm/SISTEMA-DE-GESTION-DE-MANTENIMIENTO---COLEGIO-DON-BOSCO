import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { FaFileLines, FaLocationDot, FaCloudArrowUp, FaXmark } from 'react-icons/fa6';
import { crearRequerimiento } from '../services/requerimientosApiService';
import { useToast } from '../../../shared/context/ToastContext';
import Encabezado from '../../../shared/components/EncabezadoPagina';
import '../styles/EmitirRequerimientoPage.css';

const LUGARES = [
  'Aula 12',
  'Baño Pabellón B',
  'Patio',
  'Laboratorio 3',
  'Dirección',
  'Pasillo principal',
  'Biblioteca',
  'Gimnasio',
  'Cocina',
  'Otro',
];

const MAX_TITULO = 100;
const MAX_DESCRIPCION = 500;

function EmitirRequerimientoPage() {
  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const inputFileRef = useRef(null);

  const [formData, setFormData] = useState({ titulo: '', descripcion: '', lugar: '' });
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [leyendoImagen, setLeyendoImagen] = useState(false);

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
      setImagen({
        archivo: file,
        url: reader.result,
        nombre: file.name,
        peso: file.size,
      });
    };

    reader.onerror = () => {
      setError('No se pudo leer la imagen seleccionada.');
    };

    reader.onloadend = () => {
      setLeyendoImagen(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => aceptarImagen(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    aceptarImagen(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const quitarImagen = () => {
    setImagen(null);
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.lugar.trim()) {
      setError('Por favor completá los campos obligatorios (*).');
      return;
    }

    setGuardando(true);

    try {
      const creado = await crearRequerimiento({
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        sector: formData.lugar,
        imagen: imagen?.url ?? null,
      });

      mostrarToast(
        `Requerimiento REQ-${String(creado.id).padStart(4, '0')} emitido correctamente`,
        'success',
      );
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
        subtitulo="Completá la información del problema edilicio o de infraestructura que querés reportar."
      />

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body p-3 p-md-4">
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label">
                  Título <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="titulo"
                  className="form-control"
                  placeholder="Ej: Fuga de agua en baño"
                  value={formData.titulo}
                  onChange={handleChange}
                  maxLength={MAX_TITULO}
                />
                <small className="emitir-requerimiento__contador">
                  {formData.titulo.length}/{MAX_TITULO}
                </small>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Sector <span className="text-danger">*</span>
                </label>
                <div className="emitir-requerimiento__select-icono">
                  <FaLocationDot className="emitir-requerimiento__select-icono-svg" />
                  <select
                    name="lugar"
                    className="form-select"
                    value={formData.lugar}
                    onChange={handleChange}
                  >
                    <option value="">Seleccioná el sector</option>
                    {LUGARES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-0">
              <label className="form-label">
                Descripción detallada <span className="text-danger">*</span>
              </label>
              <textarea
                name="descripcion"
                className="form-control"
                rows={5}
                placeholder="Describí el problema con la mayor cantidad de detalles posible..."
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

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <label className="form-label mb-3">Agregar imagen (opcional)</label>

            <div className="emitir-requerimiento__imagenes">
              <div
                className={`emitir-requerimiento__dropzone ${
                  dragging ? 'emitir-requerimiento__dropzone--activa' : ''
                }`}
                onClick={() => inputFileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FaCloudArrowUp size={32} className="emitir-requerimiento__dropzone-icono" />
                <p className="emitir-requerimiento__dropzone-texto">
                  Arrastrá una imagen o <strong>seleccioná un archivo</strong>
                </p>
                <small className="emitir-requerimiento__dropzone-hint">
                  Formatos admitidos: JPG, PNG. Máx. 5 MB
                </small>
                <input
                  ref={inputFileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileInput}
                  hidden
                />
              </div>

              {imagen && (
                <div className="emitir-requerimiento__preview">
                  <img src={imagen.url} alt={imagen.nombre} />
                  <button
                    type="button"
                    className="emitir-requerimiento__preview-quitar"
                    onClick={quitarImagen}
                    aria-label="Quitar imagen"
                  >
                    <FaXmark size={12} />
                  </button>
                  <div className="emitir-requerimiento__preview-info">
                    <span className="emitir-requerimiento__preview-nombre">
                      {imagen.nombre}
                    </span>
                    <small className="emitir-requerimiento__preview-peso">
                      {(imagen.peso / 1024 / 1024).toFixed(1)} MB
                    </small>
                  </div>
                </div>
              )}
            </div>

            {leyendoImagen && (
              <small className="text-muted d-block mt-2">Procesando imagen...</small>
            )}
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-light border"
            onClick={() => navigate(-1)}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={guardando || leyendoImagen}
          >
            {guardando ? 'Emitiendo...' : 'Emitir requerimiento'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmitirRequerimientoPage;
