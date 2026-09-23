import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CAROUSEL_ITEMS = [
  {
    id: 1,
    image: "/assets/colegio/foto4.PNG",
    title: "Don Bosco San Luis",
    subtitle: "Formando jóvenes con valores y compromiso",
  },
  {
    id: 2,
    image: "/assets/colegio/foto2.png",
    title: "Movimiento Juvenil Salesiano",
    subtitle: "Pastoral y creatividad al servicio",
  },
  {
    id: 3,
    image: "/assets/colegio/foto3.png",
    title: "Educación Integral",
    subtitle: "Inicial, Primario y Secundario",
  },
  {
    id: 4,
    image: "/assets/colegio/foto1.jpg",
    title: "Comunidad Salesiana",
    subtitle: "Un espacio de fe, amistad y compromiso",
  },
  {
    id: 5,
    image: "/assets/colegio/foto5.jpg",
    title: "Valores en Acción",
    subtitle: "Solidaridad, respeto y responsabilidad",
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => setCurrentSlide(index);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);

  const prevSlide = () =>
    setCurrentSlide((prev) =>
      prev === 0 ? CAROUSEL_ITEMS.length - 1 : prev - 1,
    );

  const currentItem = CAROUSEL_ITEMS[currentSlide];

  return (
    <section className="hero-banner">
      {/* Carousel Container */}
      <div className="carousel-container">
        {/* Background Image */}
        <img
          src={currentItem.image}
          alt={currentItem.title}
          className="carousel-image"
        />

        {/* Overlay Content */}
        <div className="carousel-caption">
          <h1 className="carousel-title">{currentItem.title}</h1>
          <p className="carousel-subtitle">{currentItem.subtitle}</p>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="carousel-controls">
        {/* Previous Button */}
        <button
          className="carousel-btn carousel-btn-prev"
          onClick={prevSlide}
          aria-label="Imagen anterior"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Indicators */}
        <div className="carousel-indicators">
          {CAROUSEL_ITEMS.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a la imagen ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          className="carousel-btn carousel-btn-next"
          onClick={nextSlide}
          aria-label="Siguiente imagen"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
