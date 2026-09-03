import { AvailabilityPanel } from '../components/AvailabilityPanel'
import { ErrorMessage } from '../components/ErrorMessage'
import { Link } from '../components/Link'
import { Loading } from '../components/Loading'
import { VehicleGallery } from '../components/VehicleGallery'
import { VehicleSpecs } from '../components/VehicleSpecs'
import { useVehicle } from '../hooks/useVehicle'
import { formatCurrency } from '../utils/formatters'
import { resolveVehicleImages } from '../utils/vehicleImages'
import { VEHICLE_STATUS } from '../utils/vehicleStatuses'

export function VehicleDetailPage({ id, navigate }) {
  const { error, isLoading, reload, vehicle } = useVehicle(id)
  const catalogLocation = typeof window.history.state?.catalogLocation === 'string'
    && (window.history.state.catalogLocation === '/vehiculos'
      || window.history.state.catalogLocation.startsWith('/vehiculos?'))
    ? window.history.state.catalogLocation
    : '/vehiculos'

  if (isLoading) {
    return <div className="container detail-state"><Loading message="Cargando vehículo..." /></div>
  }

  if (error) {
    return (
      <div className="container detail-state">
        <ErrorMessage
          error={error}
          message="No fue posible consultar la información de este vehículo."
          onRetry={reload}
          title="No pudimos cargar el vehículo"
        />
      </div>
    )
  }

  if (!vehicle || vehicle.status === VEHICLE_STATUS.INACTIVE || vehicle.active === false) {
    return (
      <section className="page-section">
        <div className="container narrow">
          <p className="eyebrow">Vehículo no disponible</p>
          <h1>No encontramos este vehículo</h1>
          <p>Es posible que haya sido retirado del catálogo.</p>
          <Link className="button button--primary" navigate={navigate} to="/vehiculos">
            Volver al catálogo
          </Link>
        </div>
      </section>
    )
  }

  const brand = vehicle.brand ?? vehicle.make ?? 'Vehículo'
  const model = vehicle.model ?? ''
  const name = `${brand} ${model}`.trim()
  const dailyPrice = vehicle.pricePerDay ?? vehicle.dailyPrice ?? vehicle.price
  const { fallbackImage, images, isDemo } = resolveVehicleImages(vehicle)

  return (
    <article className="vehicle-detail">
      <div className="container">
        <Link className="detail-back" navigate={navigate} to={catalogLocation}>
          <span aria-hidden="true">←</span> Volver al catálogo
        </Link>
        <div className="vehicle-detail__grid">
          <div>
            <VehicleGallery key={id} fallbackImage={fallbackImage} images={images} isDemo={isDemo} vehicleName={name} />
            <section className="vehicle-detail__info" aria-labelledby="vehicle-name">
              <p className="eyebrow">{vehicle.category ?? 'Vehículo'}</p>
              <h1 id="vehicle-name">{name}</h1>
              <VehicleSpecs vehicle={vehicle} />
              <div className="vehicle-description">
                <h2>Acerca de este vehículo</h2>
                <p>
                  {vehicle.description ??
                    'Consulta sus características y disponibilidad para tu próximo viaje.'}
                </p>
              </div>
            </section>
          </div>
          <AvailabilityPanel
            initialDates={window.history.state?.reservationDates}
            navigate={navigate}
            price={formatCurrency(dailyPrice)}
            vehicleId={id}
          />
        </div>
      </div>
    </article>
  )
}
