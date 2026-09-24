import '../styles/NivelesEducativos.css';

const niveles = [
  { id: 1, img: '/assets/colegio/jardin.png', nombre: 'Inicial' },
  { id: 2, img: '/assets/colegio/primario.jfif', nombre: 'Primario' },
  { id: 3, img: '/assets/colegio/secundario.jpg', nombre: 'Secundario' },
];

function NivelesEducativos() {
  return (
    <section id="niveles-educativos" className="py-5">
      <div className="container text-center">
        <section className="salesiano-title py-5">
          <div className="container text-center">
            <div className="d-flex align-items-center justify-content-center">
              <div className="title-line"></div>
              <h2 className="niveles-heading mx-4">Niveles Educativos</h2>
              <div className="title-line"></div>
            </div>
          </div>
        </section>

        <div className="row justify-content-center">
          {niveles.map((nivel) => (
            <div key={nivel.id} className="col-md-4 col-sm-6 mb-4">
              <div className="nivel-item">
                <div className="circle-container">
                  <img src={nivel.img} alt={nivel.nombre} className="nivel-img" />
                </div>
                <h3 className="nivel-name">{nivel.nombre}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NivelesEducativos;