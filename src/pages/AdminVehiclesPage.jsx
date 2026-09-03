import { useState } from 'react'
import { ErrorMessage } from '../components/ErrorMessage'
import { EmptyState } from '../components/EmptyState'
import { Link } from '../components/Link'
import { Loading } from '../components/Loading'
import { Pagination } from '../components/Pagination'
import { useAuth } from '../hooks/useAuth'
import { useAdminVehicles } from '../hooks/useAdminVehicles'
import { formatCurrency } from '../utils/formatters'
import { getEntityId } from '../utils/identifiers'
import { VEHICLE_STATUS_LABELS } from '../utils/vehicleStatuses'
import { formatTransmission } from '../utils/transmissions'

export function AdminVehiclesPage({ navigate }) {
  const { token } = useAuth()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const { error, isLoading, pagination, reload, vehicles } = useAdminVehicles({
    onPageOutOfRange: setPage,
    page,
    status,
    token,
  })

  function updateStatus(event) {
    setStatus(event.target.value)
    setPage(1)
  }

  return (
    <section className='catalog-page'>
      <div className='container'>
        <header className='catalog-header'>
          <p className='eyebrow'>Administración</p>
          <h1>Vehículos</h1>
          <p>Consulta el catálogo completo, incluidos los vehículos inactivos.</p>
        </header>
        <div className='catalog-summary admin-list-actions'>
          <label htmlFor='admin-vehicle-status'>
            Estado
            <select id='admin-vehicle-status' value={status} onChange={updateStatus}>
              <option value=''>Todos</option>
              {Object.entries(VEHICLE_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <button className='button button--ghost' type='button' disabled={!status} onClick={() => { setStatus(''); setPage(1) }}>Limpiar filtro</button>
          <Link className='button button--primary' navigate={navigate} to='/admin/vehiculos/nuevo'>Agregar vehículo</Link>
        </div>
        {isLoading && <Loading message='Cargando vehículos administrativos...' />}
        {!isLoading && error && (
          <ErrorMessage
            error={error}
            message='No fue posible consultar el catálogo administrativo.'
            onRetry={reload}
            title='No pudimos cargar los vehículos'
          />
        )}
        {!isLoading && !error && vehicles.length === 0 && (
          <EmptyState
            actionLabel='Ver todos los estados'
            message={status ? 'Selecciona otro estado para consultar el catálogo administrativo.' : 'Agrega un vehículo para comenzar el catálogo.'}
            onAction={status ? () => { setStatus(''); setPage(1) } : undefined}
            title={status ? 'No hay vehículos con este estado' : 'No hay vehículos registrados'}
          />
        )}
        {!isLoading && !error && vehicles.length > 0 && (
          <>
            <p className='catalog-summary' aria-live='polite'>
              {pagination.totalItems} vehículos encontrados
            </p>
            <div className='vehicle-grid'>
              {vehicles.map((vehicle, index) => {
                const id = getEntityId(vehicle)
                return <article className='account-card' key={id ?? `vehicle-${index}`}>
                  <p className='eyebrow'>{VEHICLE_STATUS_LABELS[vehicle.status] ?? vehicle.status}</p>
                  <h2>{vehicle.brand} {vehicle.model}</h2>
                  <p>{vehicle.year} · {vehicle.category} · {formatTransmission(vehicle.transmission)}</p>
                  <p><strong>{formatCurrency(vehicle.pricePerDay)}</strong> por día</p>
                  {id ? <Link className='button button--ghost' navigate={navigate} to={`/admin/vehiculos/${encodeURIComponent(id)}`}>Administrar</Link> : <span>Administración no disponible</span>}
                </article>
              })}
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              onPageChange={setPage}
              totalPages={pagination.totalPages}
            />
          </>
        )}
      </div>
    </section>
  )
}
