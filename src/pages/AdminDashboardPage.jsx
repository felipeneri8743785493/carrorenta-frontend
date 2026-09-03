import { AdminStats } from '../components/AdminStats'
import { Link } from '../components/Link'

const sections = [
  ['Vehículos', 'Consulta y administra los vehículos del catálogo.', '/admin/vehiculos'],
  ['Reservaciones', 'Revisa las reservaciones realizadas por los clientes.', '/admin/reservaciones'],
  ['Usuarios', 'Consulta las cuentas y roles registrados.', '/admin/usuarios'],
]

export function AdminDashboardPage({ navigate }) {
  return (
    <section className='account-page'>
      <div className='container'>
        <header className='section-heading'>
          <div>
            <p className='eyebrow'>Administración</p>
            <h1>Panel de control</h1>
            <p>Administra la operación de CarroRenta desde un solo lugar.</p>
          </div>
        </header>
        <AdminStats />
        <div className='account-settings'>
          {sections.map(([title, description, to]) => (
            <article className='account-card' key={to}>
              <h2>{title}</h2>
              <p>{description}</p>
              <Link className='button button--ghost' navigate={navigate} to={to}>Abrir sección</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
