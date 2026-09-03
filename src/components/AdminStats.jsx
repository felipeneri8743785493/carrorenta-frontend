import { useAuth } from '../hooks/useAuth'
import { useAdminStats } from '../hooks/useAdminStats'
import { formatCurrency } from '../utils/formatters'
import { RESERVATION_STATUS_LABELS_PLURAL } from '../utils/reservationStatuses'
import { VEHICLE_STATUS_LABELS_PLURAL } from '../utils/vehicleStatuses'
import { ErrorMessage } from './ErrorMessage'
import { Loading } from './Loading'

const labels = {
  ...VEHICLE_STATUS_LABELS_PLURAL,
  ...RESERVATION_STATUS_LABELS_PLURAL,
}

const displayMetric = (value) => value ?? 'No disponible'

function Breakdown({ title, values }) {
  const entries = Object.entries(values)

  return (
    <article className='stats-breakdown'>
      <h3>{title}</h3>
      {entries.length > 0 ? <dl>
        {entries.map(([status, total]) => (
          <div key={status}><dt>{labels[status] ?? status}</dt><dd>{displayMetric(total)}</dd></div>
        ))}
      </dl> : <p>No hay desglose disponible.</p>}
    </article>
  )
}

export function AdminStats() {
  const { token } = useAuth()
  const { error, isLoading, reload, stats } = useAdminStats(token)

  if (isLoading) return <Loading message='Cargando estadísticas...' />
  if (error) return <ErrorMessage error={error} onRetry={reload} title='No pudimos cargar las estadísticas' />

  return (
    <section className='admin-stats' aria-labelledby='stats-heading'>
      <h2 id='stats-heading'>Resumen operativo</h2>
      <div className='stats-grid'>
        <article><span>Usuarios</span><strong>{displayMetric(stats.users.total)}</strong></article>
        <article><span>Vehículos</span><strong>{displayMetric(stats.vehicles.total)}</strong></article>
        <article><span>Reservaciones</span><strong>{displayMetric(stats.reservations.total)}</strong></article>
        <article><span>Ingresos completados</span><strong>{formatCurrency(stats.reservations.completedRevenue)}</strong></article>
      </div>
      <div className='stats-details'>
        <Breakdown title='Vehículos por estado' values={stats.vehicles.byStatus} />
        <Breakdown title='Reservaciones por estado' values={stats.reservations.byStatus} />
      </div>
    </section>
  )
}
