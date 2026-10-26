export function mapearTarea(row) {
  if (!row) return null;

  return {
    id: row.id,
    idRequerimiento: row.idRequerimiento,
    requerimientoTitulo: row.requerimientoTitulo,
    titulo: row.titulo,
    descripcion: row.descripcion,
    idSector: row.idSector,
    sector: row.sector,
    lugar: row.lugar,
    reportadoPor: row.reportadoPor,
    rolReportante: row.rolReportante,
    prioridad: row.prioridad,
    estado: row.estado,
    responsable: row.responsableNombre
      ? { nombre: row.responsableNombre, tipo: row.responsableTipo }
      : null,
    telefono: row.telefono,
    observaciones: row.observaciones,
    fechaCreacion: row.fechaCreacion,
    fechaInicio: row.fechaInicio,
    fechaFin: row.fechaFin,
    idDirectivo: row.idDirectivo,
    idResponsable: row.idResponsable,
    idPersonalExterno: row.idPersonalExterno,
    idTareaOrigen: row.idTareaOrigen,
    costoPersonalExterno: row.costoPersonalExterno,
  };
}
