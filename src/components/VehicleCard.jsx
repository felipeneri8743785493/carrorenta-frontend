import { useState } from 'react'
import { formatCurrency } from '../utils/formatters'
import { getEntityId } from '../utils/identifiers'
import { resolveVehicleImages } from '../utils/vehicleImages'
import { formatTransmission } from '../utils/transmissions'
import { Link } from './Link'

export function VehicleCard({ catalogLocation = '/vehiculos', navigate, vehicle }) {
  const id = getEntityId(vehicle)
  const brand = vehicle.brand ?? vehicle.make ?? 'Vehículo'
  const model = vehicle.model ?? ''
  const price = vehicle.pricePerDay ?? vehicle.dailyPrice ?? vehicle.price
  const { fallbackImage, images, isDemo } = resolveVehicleImages(vehicle)
  const [imageFailed, setImageFailed] = useState(false)
  const [fallbackFailed, setFallbackFailed] = useState(false)
  const showingDemo = isDemo || imageFailed
  const image = imageFailed ? fallbackImage : images[0]

  return (
    <article className="vehicle-card">
      <div className="vehicle-card__media">
        <span aria-hidden="true">CR</span>
        {image && !fallbackFailed && (
          <img
            src={image}
            alt=""
            decoding="async"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => showingDemo ? setFallbackFailed(true) : setImageFailed(true)}
          />
        )}
        {showingDemo && !fallbackFailed && <span className='vehicle-image-note'>Imagen de demostración</span>}
      </div>
      <div className="vehicle-card__body">
        <div className="vehicle-card__heading">
          <div>
            <p className="vehicle-card__category">
              {vehicle.category ?? 'Sin categoría'}
            </p>
            <h2>{brand} {model}</h2>
          </div>
          {vehicle.year && <span className="vehicle-card__year">{vehicle.year}</span>}
        </div>
        <dl className="vehicle-card__details">
          <div>
            <dt>Transmisión</dt>
            <dd>{formatTransmission(vehicle.transmission)}</dd>
          </div>
          <div>
            <dt>Asientos</dt>
            <dd>{vehicle.seats ?? '—'}</dd>
          </div>
        </dl>
        <div className="vehicle-card__footer">
          <p><strong>{formatCurrency(price)}</strong><span> / día</span></p>
          {id ? (
            <Link className="text-link" navigate={navigate} state={{ catalogLocation }} to={`/vehiculos/${encodeURIComponent(id)}`}>
              Ver detalles <span aria-hidden="true">→</span>
            </Link>
          ) : <span className="text-link">Detalle no disponible</span>}
        </div>
      </div>
    </article>
  )
}
