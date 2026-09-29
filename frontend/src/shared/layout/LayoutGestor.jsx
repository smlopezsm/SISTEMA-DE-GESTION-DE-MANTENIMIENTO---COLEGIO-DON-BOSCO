//es el area privada, solo los usuarios logueados con el rol
//envuelve todas las pagnas del gestor con el sidebar y el contenedor principal donde se renderiza
import { Outlet, useLoaderData } from 'react-router';
import Sidebar from './Sidebar';
 
function LayoutGestor() {

  // useLoaderData() obtiene lo que o el loader de la ruta padre
  const usuario = useLoaderData();
 
  return (
    <>

    {/*pasamos el usuario al Sidebar para que muestre solo las opciones correspondientes al rol */}
      <Sidebar usuario={usuario} />
      <div className="main-content">
        <div className="container-fluid px-3 px-md-4">

           {/* <Outlet /> renderiza la pagina hija segun la ruta activa
              context={usuario} hace que las paginas hijas puedan obtener
              el usuario con useOutletContext() */}
          <Outlet context={usuario} />
        </div>
      </div>
    </>
  );
}
 
export default LayoutGestor;
 