import { useCallback, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { Pagination } from '../components/Pagination'
import { VehicleCard } from '../components/VehicleCard'
import { VehicleFilters } from '../components/VehicleFilters'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useVehicles } from '../hooks/useVehicles'
import { getEntityId } from '../utils/identifiers'
import { normalizeFutureDateRange } from '../utils/formatters'
import { TRANSMISSIONS } from '../utils/transmissions'

const initialFilters = { category: '', transmission: '', startDate: '', endDate: '' }

function getCatalogState(search) {
  const query = new URLSearchParams(search)
  const pageValue = query.get('page') ?? ''
  const parsedPage = /^\d+$/.test(pageValue) ? Number(pageValue) : 1
  const category = (query.get('category') ?? '').trim().slice(0, 50)
  const transmissionValue = query.get('transmission') ?? ''
  const transmission = TRANSMISSIONS.includes(transmissionValue) ? transmissionValue : ''
  const { startDate, endDate } = normalizeFutureDateRange({
    startDate: query.get('startDate'),
    endDate: query.get('endDate'),
  })

  return {
    filters: { category, transmission, startDate, endDate },
    page: Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1,
  }
}

function getCatalogLocation(filters, page) {
  const query = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })
  if (page > 1) query.set('page', String(page))
  return `/vehiculos${query.size ? `?${query}` : ''}`
}

export function VehiclesPage({ navigate, search }) {
  const initialState = getCatalogState(search)
  const [filters, setFilters] = useState(initialState.filters)
  const [page, setPageState] = useState(initialState.page)
  const debouncedCategory = useDebouncedValue(filters.category)
  const correctPage = useCallback((nextPage) => {
    setPageState(nextPage)
    const query = new URLSearchParams(window.location.search)
    if (nextPage > 1) query.set('page', String(nextPage))
    else query.delete('page')
    navigate(`/vehiculos${query.size ? `?${query}` : ''}`, { replace: true })
  }, [navigate])
  const { error, isLoading, pagination, reload, vehicles } = useVehicles({
    ...filters,
    category: debouncedCategory,
    onPageOutOfRange: correctPage,
    page,
  })

  function updateFilters(nextFilters) {
    setFilters(nextFilters)
    setPageState(1)
    updateLocation(nextFilters, 1)
  }

  function clearFilters() {
    updateFilters(initialFilters)
  }

  function updateLocation(nextFilters, nextPage) {
    navigate(getCatalogLocation(nextFilters, nextPage), { replace: true })
  }

  function setPage(nextPage) {
    setPageState(nextPage)
    updateLocation(filters, nextPage)
  }

  const catalogLocation = `/vehiculos${search}`

  return (
    <section className="catalog-page">
      <div className="container">
        <header className="catalog-header">
          <p className="eyebrow">Catálogo</p>
          <h1>Vehículos para cada viaje</h1>
          <p>Filtra las opciones y encuentra el vehículo que se adapta a tu camino.</p>
        </header>
        <VehicleFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />
        {isLoading && <Loading message="Cargando catálogo de vehículos..." />}
        {!isLoading && error && <ErrorMessage error={error} onRetry={reload} title='No pudimos cargar los vehículos' />}
        {!isLoading && !error && vehicles.length === 0 && <EmptyState onAction={clearFilters} />}
        {!isLoading && !error && vehicles.length > 0 && (
          <>
            <div className="catalog-summary" aria-live="polite">
              <p>{pagination.totalItems} vehículos encontrados</p>
            </div>
            <div className="vehicle-grid">
              {vehicles.map((vehicle, index) => (
                <VehicleCard
                  key={getEntityId(vehicle) ?? `vehicle-${index}`}
                  catalogLocation={catalogLocation}
                  navigate={navigate}
                  vehicle={vehicle}
                />
              ))}
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </section>
  )
}
