const slides = [
  { id: 1, img: 'public/assets/colegio/foto4.PNG', titulo: 'Don Bosco San Luis', texto: 'Formando jóvenes con valores y compromiso' },
  { id: 2, img: 'public/assets/colegio/foto2.png', titulo: 'Movimiento Juvenil Salesiano', texto: 'Pastoral y creatividad al servicio' },
  { id: 3, img: 'public/assets/colegio/foto3.png', titulo: 'Educacion Integral', texto: 'Incial, Primario y Secundario' },
  { id: 4, img: 'public/assets/colegio/foto1.jpg', titulo: 'Comunidad Salesiana:', texto: 'Un espacio de fe, amistad y compromiso' },
  { id: 5, img: 'public/assets/colegio/foto5.jpg', titulo: 'Valores en Acción', texto: 'Solidaridad, respeto y responsabilidad' },
];

function Hero() {
  return (
    <section id="banner" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
      <div className="carousel-indicators">
        {slides.map((slide, indice) => (
          <button
            key={slide.id}
            type="button"
            data-bs-target="#banner"
            data-bs-slide-to={indice}
            className={indice === 0 ? 'active' : ''}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        {slides.map((slide, indice) => (
          <div key={slide.id} className={`carousel-item ${indice === 0 ? 'active' : ''}`}>
            <img src={slide.img} className="d-block w-100 banner-img" alt={`Banner ${indice + 1}`} />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center animate-text">
              <h1 className="fw-bold">{slide.titulo}</h1>
              <p className="lead">{slide.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Hero;