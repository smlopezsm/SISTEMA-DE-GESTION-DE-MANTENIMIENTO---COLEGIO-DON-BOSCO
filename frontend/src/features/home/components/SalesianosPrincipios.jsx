import '../styles/SalesianosPrincipios.css';

const pilares = [
  { id: 1, icono: 'fa-solid fa-house-chimney', nombre: 'Casa' },
  { id: 2, icono: 'fa-solid fa-book-open', nombre: 'Escuela' },
  { id: 3, icono: 'fa-solid fa-basketball', nombre: 'Patio' },
  { id: 4, icono: 'fa-solid fa-church', nombre: 'Parroquia' },
];

function SalesianoPrincipios() {
  return (
    <section id="logos-salesianos" className="py-5">
      <div className="container text-center">
        <section className="salesiano-title py-5">
          <div className="container text-center">
            <div className="d-flex align-items-center justify-content-center">
              <div className="title-line"></div>
              <h2 className="salesiano-heading mx-4">Un colegio salesiano es</h2>
              <div className="title-line"></div>
            </div>
          </div>
        </section>
        <div className="row g-4 justify-content-center">
          {pilares.map((pilar) => (
            <div key={pilar.id} className="col-md-3 col-6">
              <div className="logo-card">
                <div className="icon-box">
                  <i className={pilar.icono}></i>
                </div>
                <p>{pilar.nombre}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SalesianoPrincipios;