import { ArrowRight } from "lucide-react";

const NOTICIAS = [
  {
    id: 1,
    titulo: "Valores Cuota Agosto 2026",
    excerpt:
      "Estimadas familias: En función de los incrementos salariales de público conocimiento...",
    imagen: "/assets/colegio/agosto.webp",
    link: "#",
  },
  {
    id: 2,
    titulo: "Inscripciones Nivel Inicial",
    excerpt:
      "¡Inscripciones Abiertas Nivel Inicial 2027! Querida comunidad, informamos que ya está habilitada la postulación...",
    imagen: "/assets/colegio/inscripciones.png",
    link: "#",
  },
  {
    id: 3,
    titulo: "Valores Cuota Junio 2026",
    excerpt:
      "Estimadas familias: Les informamos los valores por los servicios educativos para el mes de junio de 2026...",
    imagen: "/assets/colegio/julio.jpg",
    link: "#",
  },
];

export default function Novedades() {
  return (
    <section className="novedades-section">
      <div className="section-container">
        <div className="section-title-wrapper">
          <div className="title-line"></div>
          <h2 className="section-title">Novedades</h2>
          <div className="title-line"></div>
        </div>

        <div className="noticias-grid">
          {NOTICIAS.map((noticia) => (
            <article key={noticia.id} className="news-card">
              <div className="news-image-wrapper">
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="news-image"
                />
              </div>
              <div className="news-content">
                <h3 className="news-title">{noticia.titulo}</h3>
                <p className="news-excerpt">{noticia.excerpt}</p>
                <a href={noticia.link} className="btn-read-more">
                  LEER MÁS
                  <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
