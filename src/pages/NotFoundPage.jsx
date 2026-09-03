import { Link } from '../components/Link'

export function NotFoundPage({ navigate }) {
  return (
    <section className="page-section">
      <div className="container narrow">
        <p className="eyebrow">Error 404</p>
        <h1>Página no encontrada</h1>
        <p>La dirección que buscas no existe o cambió de ubicación.</p>
        <Link className="button button--primary" navigate={navigate} to="/">
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}