const NIVELES = [
  {
    id: 1,
    nombre: "Inicial",
    imagen: "/assets/colegio/jardin.png",
  },
  {
    id: 2,
    nombre: "Primario",
    imagen: "/assets/colegio/primario.jfif",
  },
  {
    id: 3,
    nombre: "Secundario",
    imagen: "/assets/colegio/secundario.jpg",
  },
];

export default function NivelesEducativos() {
  return (
    <section className="niveles-section">
      <div className="section-container">
        <div className="section-title-wrapper">
          <div className="title-line"></div>
          <h2 className="section-title">Niveles Educativos</h2>
          <div className="title-line"></div>
        </div>

        <div className="niveles-grid">
          {NIVELES.map((nivel) => (
            <div key={nivel.id} className="nivel-card">
              <div className="nivel-image-wrapper">
                <img
                  src={nivel.imagen}
                  alt={nivel.nombre}
                  className="nivel-image"
                />
              </div>
              <h3 className="nivel-name">{nivel.nombre}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
