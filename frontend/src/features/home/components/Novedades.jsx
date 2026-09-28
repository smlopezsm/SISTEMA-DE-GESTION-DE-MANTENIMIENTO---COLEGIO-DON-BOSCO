import '../styles/Novedades.css';

const novedades = [
  { id: 1, img: '/assets/colegio/agosto.webp', titulo: 'Valores Cuota Agosto 2026', extracto: 'Estimadas familias: En función de los incrementos salariales de público conocimiento...' },
  { id: 2, img: '/assets/colegio/inscripciones.png', titulo: 'Inscripciones Nivel Inicial', extracto: '¡Inscripciones Abiertas Nivel Inicial 2027! Querida comunidad, informamos que ya está habilitada la postulación...' },
  { id: 3, img: '/assets/colegio/julio.jpg', titulo: 'Valores Cuota Junio 2026', extracto: 'Estimadas familias: Les informamos los valores por los servicios educativos para el mes de junio de 2026...' },
];

function Novedades() {
  return(
    <section className="novedades-section py-5">
      <div className="container">
        <div className="d-flex align-items-center justify-content-center mb-5">
          <div className="title-line"></div>
          <h2 className="novedades-title mx-4">Novedades</h2>
          <div className="title-line"></div>
        </div>

        <div className="row g-4">
          {novedades.map((novedad) => (
            <div key={novedad.id} className="col-md-4">
              <div className="news-card">
                <div className="news-image-wrapper">
                  <img src={novedad.img} alt={novedad.titulo} />
                </div>
                <div className="news-content">
                  <h3 className="news-title">{novedad.titulo}</h3>
                  <p className="news-excerpt">{novedad.extracto}</p>
                  <a href="#" className="btn-read-more">LEER MÁS »</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Novedades;