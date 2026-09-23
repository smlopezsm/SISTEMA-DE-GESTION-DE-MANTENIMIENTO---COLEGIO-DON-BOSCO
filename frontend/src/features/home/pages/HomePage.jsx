import HeroBanner from "../components/HeroBanner";
import NivelesEducativos from "../components/NivelesEducativos";
import SalesianoPrincipios from "../components/SalecianosPrincipios";
import Novedades from "../components/Novedades";
import "../styles/home.css";

function HomePage() {
  return (
    <div className="site-container">
      <div className="top-line"></div>
      <HeroBanner />
      <NivelesEducativos />
      <SalesianoPrincipios />
      <Novedades />
    </div>
  );
}

export default HomePage;
