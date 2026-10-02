// src/features/requerimientos/pages/EmitirRequerimientoPage.jsx
import { useState, useRef } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router';
import { FaArrowLeft, FaFileLines, FaLocationDot, FaCloudArrowUp, FaImage, FaXmark, } from 'react-icons/fa6';
import { crearRequerimiento } from '../services/requerimientosService';
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
  const usuario = useOutletContext();
  const inputFileRef = useRef(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    lugar: '',
  });
  const [imagen, setImagen] = useState(null); // { archivo, url, nombre, peso }
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  // ─────────────────────────────────────────
  // Cambios en inputs de texto
  // ─────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // ─────────────────────────────────────────
  // Manejo de imagen (input + drag & drop)
  // ─────────────────────────────────────────
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
    const url = URL.createObjectURL(file);
    setImagen({ archivo: file, url, nombre: file.name, peso: file.size });
    setError('');
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
    if (imagen?.url) URL.revokeObjectURL(imagen.url);
    setImagen(null);
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  // ─────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.lugar.trim()) {
      setError('Por favor completá los campos obligatorios (*).');
      return;
    }

    crearRequerimiento({
      ...formData,
      reportadoPor: usuario?.nombre ?? 'Usuario',
      rolReportante: usuario?.rol ?? 'ordenanza',
      imagen: imagen?.url ?? null,
    });

    navigate('/gestor/requerimientos/mis-requerimientos');
  };

  return (
    <div className="emitir-requerimiento">
      {/* ─────────── Encabezado ─────────── */}
      <Link to="/gestor/requerimientos" className="emitir-requerimiento__volver">
        <FaArrowLeft size={14} /> Volver
      </Link>

      <div className="emitir-requerimiento__encabezado">
        <div className="emitir-requerimiento__icono">
          <FaFileLines size={22} />
        </div>
        <div>
          <h1 className="emitir-requerimiento__titulo">Emitir requerimiento</h1>
          <p className="emitir-requerimiento__subtitulo">
            Completá la información del problema edilicio o de infraestructura que querés reportar.
          </p>
        </div>
      </div>

      {/* ─────────── Error ─────────── */}
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ─────────── Card principal ─────────── */}
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body p-3 p-md-4">
            <div className="row g-3 mb-3">
              {/* Título */}
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

              {/* Lugar físico */}
              <div className="col-12 col-md-6">
                <label className="form-label">
                  Lugar físico <span className="text-danger">*</span>
                </label>
                <div className="emitir-requerimiento__select-icono">
                  <FaLocationDot className="emitir-requerimiento__select-icono-svg" />
                  <select
                    name="lugar"
                    className="form-select"
                    value={formData.lugar}
                    onChange={handleChange}
                  >
                    <option value="">Seleccioná un lugar</option>
                    {LUGARES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Descripción */}
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

        {/* ─────────── Card imagen ─────────── */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <label className="form-label mb-3">Agregar imagen (opcional)</label>

            <div className="emitir-requerimiento__imagenes">
              {/* Zona drag & drop */}
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

              {/* Vista previa */}
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
          </div>
        </div>

        {/* ─────────── Botones ─────────── */}
        <div className="d-flex gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-light border"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Emitir requerimiento
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmitirRequerimientoPage;