import { Link } from '../components/Link'

export function HomePage({ navigate }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="eyebrow">Tu próximo viaje comienza aquí</p>
          <h1 id="hero-title">Encuentra el vehículo ideal para cada camino.</h1>
          <p className="hero__description">
            Consulta opciones confiables y prepárate para reservar de forma
            clara, segura y sencilla.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary button--large" navigate={navigate} to="/vehiculos">
              Explorar vehículos
            </Link>
            <Link className="text-link" navigate={navigate} to="/registro">
              Crear una cuenta <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <aside className="hero__visual" aria-label="Ventajas de CarroRenta">
          <div className="road" aria-hidden="true"><span className="road__line" /></div>
          <div className="feature-card">
            <span className="feature-card__number">01</span>
            <div>
              <strong>Reserva con confianza</strong>
              <p>Disponibilidad y precios validados por nuestro sistema.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}