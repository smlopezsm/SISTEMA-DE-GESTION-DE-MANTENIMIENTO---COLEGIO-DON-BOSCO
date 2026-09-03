document.addEventListener("DOMContentLoaded", () => {
  const formReporte = document.querySelector("#form-reporte");

  if (formReporte) {
    formReporte.addEventListener("submit", (evento) => {
      evento.preventDefault(); // Evitamos que la página se recargue

      const titulo = document.querySelector("#titulo").value;
      const lugar = document.querySelector("#lugar").value;
      const descripcion = document.querySelector("#descripcion").value;

      if (titulo.length < 5) {
        alert("El título es muy corto. Por favor, sé más descriptivo.");
        return;
      }

      if (lugar === "") {
        alert("Debes seleccionar el lugar físico del problema.");
        return;
      }

      alert(`¡Requerimiento emitido con éxito!\nLugar: ${lugar}\nQueda registrada la firma digital del usuario logueado.`);
      formReporte.reset(); // Limpiamos el formulario
    });
  }
});