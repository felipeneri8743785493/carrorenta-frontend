function Spec({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value ?? 'No especificado'}</dd>
    </div>
  )
}

export function VehicleSpecs({ vehicle }) {
  return (
    <dl className="vehicle-specs">
      <Spec label="Año" value={vehicle.year} />
      <Spec label="Categoría" value={vehicle.category} />
      <Spec label="Transmisión" value={formatTransmission(vehicle.transmission)} />
      <Spec label="Asientos" value={vehicle.seats} />
      <Spec label="Estado" value={VEHICLE_STATUS_LABELS[vehicle.status] ?? vehicle.status} />
    </dl>
  )
}
import { formatTransmission } from '../utils/transmissions'
import { VEHICLE_STATUS_LABELS } from '../utils/vehicleStatuses'
