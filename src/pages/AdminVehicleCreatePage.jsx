import { AdminVehicleForm } from '../components/AdminVehicleForm'
import { Link } from '../components/Link'
import { useAuth } from '../hooks/useAuth'
import { createAdminVehicle } from '../services/adminVehicleService'
import { getEntityId } from '../utils/identifiers'

export function AdminVehicleCreatePage({ navigate }) {
  const { token } = useAuth()

  async function create(vehicle) {
    const saved = await createAdminVehicle(vehicle, token)
    const id = getEntityId(saved)
    navigate(id ? `/admin/vehiculos/${encodeURIComponent(id)}` : '/admin/vehiculos')
    return saved
  }

  return (
    <section className='account-page'><div className='container'>
      <Link className='detail-back' navigate={navigate} to='/admin/vehiculos'>Volver a vehículos</Link>
      <div className='account-card'>
        <p className='eyebrow'>Administración</p>
        <h1>Agregar vehículo</h1>
        <p>Registra un vehículo nuevo en el catálogo.</p>
        <AdminVehicleForm onSubmit={create} successMessage='Vehículo creado correctamente.' />
      </div>
    </div></section>
  )
}
