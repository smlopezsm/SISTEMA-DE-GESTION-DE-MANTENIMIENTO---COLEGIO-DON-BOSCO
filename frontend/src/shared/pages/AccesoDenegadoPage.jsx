// pagina que se muestra cuando un usuario intenta entrar a una ruta
// que NO le corresponde por su rol (por ejemplo un ordenanza queriendo
// ver /gestor/usuarios)

import { useRouteError, Link } from "react-router";

function AccesoDenegadoPage() {
  // useRouteError() captura el error que lanzo el loader o el guard de la ruta
  // devuelve un objeto con informacion como status, statusText, data, etc

  const error = useRouteError();
  //vemos si el error es 403 (sin permisos)
  // usamos ? por si error es indefinido
  const esNoAutorizado = error?.status === 403;

  return (
    <div className="text-center mt-5">

       {/*cambia segun el tipo de error*/}
      <h1 className="display-4 fw-bold text-danger">
        {esNoAutorizado ? "403" : "Error"}
      </h1>

      {/*mensaje al usuario*/}
      <p className="fs-5">
        {esNoAutorizado
          ? "No tenés permisos para acceder a esta sección."
          : "Ocurrió un error inesperado."}
      </p>
      
      <Link to="/gestor" className="btn btn-primary mt-3">
        Volver al panel
      </Link>
    </div>
  );
}

export default AccesoDenegadoPage;