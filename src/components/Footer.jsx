import { Link } from './Link'

export function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Link className="brand brand--footer" navigate={navigate} to="/">
            <span className="brand__mark" aria-hidden="true">CR</span>
            <span>CarroRenta</span>
          </Link>
          <p>Movilidad sencilla para cada destino.</p>
        </div>
        <nav aria-label="Navegación del pie">
          <ul className="footer__links">
            <li><Link navigate={navigate} to="/vehiculos">Vehículos</Link></li>
            <li><Link navigate={navigate} to="/login">Iniciar sesión</Link></li>
            <li><Link navigate={navigate} to="/registro">Registro</Link></li>
          </ul>
        </nav>
        <p className="footer__copyright">© {new Date().getFullYear()} CarroRenta</p>
      </div>
    </footer>
  )
}