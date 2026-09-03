import { Loading } from './Loading'
import { Link } from './Link'

export function ProtectedRoute({ children, isAuthenticated, isLoading, navigate }) {
  if (isLoading) {
    return <div className="container detail-state"><Loading message="Verificando tu sesión..." /></div>
  }

  if (!isAuthenticated) {
    return (
      <section className="page-section">
        <div className="container narrow">
          <p className="eyebrow">Acceso protegido</p>
          <h1>Inicia sesión para continuar</h1>
          <p>Necesitas una cuenta activa para consultar esta sección.</p>
          <Link className="button button--primary" navigate={navigate} to="/login">
            Iniciar sesión
          </Link>
        </div>
      </section>
    )
  }

  return children
}
