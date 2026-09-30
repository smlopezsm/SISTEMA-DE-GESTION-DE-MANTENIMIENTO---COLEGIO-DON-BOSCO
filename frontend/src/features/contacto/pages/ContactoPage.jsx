import "../styles/ContactoPage.css";
import CorreoItem from "../components/CorreoItem";
import ContactoBanner from "../components/ContactoBanner";


const columnaIzquierda = [
    { id: 1, area: "Nivel Inicial", email: "gavaro@donbosco.org.ar" },
    { id: 2, area: "Nivel Primario", email: "direccioncdb@obradonboscosanluis.edu.ar" },
    { id: 3, area: "Nivel Secundario", email: "rectoria@obradonboscosanluis.edu.ar" },
    { id: 4, area: "Administración", email: "aaguero@donbosco.org.ar" },
    { id: 5, area: "Proyectos o propuestas escolares", email: "comunicacion@obradonboscosanluis.edu.ar" },
];

const columnaDerecha = [
    { id: 6, area: "Secretaria Nivel Inicial", email: "cmasdeu@obradonboscosanluis.edu.ar" },
    { id: 7, area: "Secretaria Primaria turno mañana", email: "estela@obradonboscosanluis.edu.ar" },
    { id: 8, area: "Secretaria Primaria turno tarde", email: "navaro@donbosco.org.ar" },
    { id: 9, area: "Secretaria Nivel Secundario", email: "navaro@donbosco.org.ar" },
];

function ContactoPage() {
    return (
        <div className="contacto-page">
            <ContactoBanner />
            <div className="container py-5">
                <h2 className="contacto-titulo">Correos de Contacto:</h2>

                <div className="row">
                    <div className="col-md-6">
                        {columnaIzquierda.map((correo) => (
                            <CorreoItem key={correo.id} area={correo.area} email={correo.email} />
                        ))}
                    </div>

                    <div className="col-md-6">
                        {columnaDerecha.map((correo) => (
                            <CorreoItem key={correo.id} area={correo.area} email={correo.email} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactoPage;