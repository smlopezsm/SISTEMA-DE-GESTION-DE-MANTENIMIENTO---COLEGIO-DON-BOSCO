import { Home, BookOpen, Basketball, Church } from "lucide-react";

const PRINCIPIOS = [
  {
    id: 1,
    nombre: "Casa",
    icon: Home,
  },
  {
    id: 2,
    nombre: "Escuela",
    icon: BookOpen,
  },
  {
    id: 3,
    nombre: "Patio",
    icon: Basketball,
  },
  {
    id: 4,
    nombre: "Parroquia",
    icon: Church,
  },
];

export default function SalesianoPrincipios() {
  return (
    <section className="principios-section">
      <div className="section-container">
        <div className="section-title-wrapper">
          <div className="title-line"></div>
          <h2 className="section-title">Un colegio salesiano es</h2>
          <div className="title-line"></div>
        </div>

        <div className="principios-grid">
          {PRINCIPIOS.map((principio) => {
            const IconComponent = principio.icon;
            return (
              <div key={principio.id} className="principio-card">
                <div className="principio-icon">
                  <IconComponent size={48} />
                </div>
                <p className="principio-nombre">{principio.nombre}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
