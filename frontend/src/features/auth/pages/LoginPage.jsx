function LoginPage() {
  return (
    <>
      <div className="overlay"></div>
      <div className="container-fluid vh-100 d-flex align-items-center">
        <div className="row w-100">
          <div className="col-md-6 d-flex align-items-center justify-content-center order-2 order-md-1">
            <div className="quote-box">
              <p className="quote-text">"Buenos cristianos y honrados ciudadanos"</p>
              <p className="quote-author">– Don Bosco</p>
            </div>
          </div>

          <div className="col-md-6 d-flex align-items-center justify-content-center order-1 order-md-2">
            <div className="card-custom text-center w-100 mx-3">
              <img
                src="/assets/colegio/logo2.png"
                alt="Logo Colegio Don Bosco"
                className="logo-card mb-4"
              />
              <h1 className="mb-4">Sistema de Gestión de Mantenimiento</h1>
              <h2 className="mb-4">Iniciar Sesión</h2>
              <form>
                <div className="mb-3">
                  <input type="email" className="form-control-custom" placeholder="Correo electrónico" />
                </div>
                <div className="mb-3">
                  <input type="password" className="form-control-custom" placeholder="Contraseña" />
                </div>
                <div className="form-check mb-3 d-flex align-items-center">
                  <input className="form-check-input" type="checkbox" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Recordarme</label>
                </div>
                <button type="submit" className="btn-primary-custom">Ingresar</button>
                <div className="mt-4 text-center">
                  <a href="#" className="link-custom">¿Olvidaste tu contraseña?</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;