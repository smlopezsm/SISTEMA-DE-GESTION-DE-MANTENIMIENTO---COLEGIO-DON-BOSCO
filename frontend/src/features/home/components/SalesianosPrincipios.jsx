import "../styles/SalesianosPrincipios.css";
import { FaHouseChimney, FaBookOpen, FaBasketball, FaChurch } from "react-icons/fa6";

const pilares = [
  { id: 1, icono: FaHouseChimney, nombre: "Casa" },
  { id: 2, icono: FaBookOpen, nombre: "Escuela" },
  { id: 3, icono: FaBasketball, nombre: "Patio" },
  { id: 4, icono: FaChurch, nombre: "Parroquia" },
];

function SalesianosPrincipios() {
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
          {pilares.map((pilar) => {
            const Icono = pilar.icono;
            return (
              <div key={pilar.id} className="col-md-3 col-6">
                <div className="pilar-card">
                  <div className="icon-box">
                    <Icono />
                  </div>
                  <p>{pilar.nombre}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SalesianosPrincipios;