import { useEffect, useRef, useState } from 'react'
import { AdminVehicleForm } from '../components/AdminVehicleForm'
import { AuthMessage } from '../components/AuthMessage'
import { ErrorMessage } from '../components/ErrorMessage'
import { Link } from '../components/Link'
import { Loading } from '../components/Loading'
import { useAuth } from '../hooks/useAuth'
import { useAdminVehicle } from '../hooks/useAdminVehicle'
import { deactivateAdminVehicle, updateAdminVehicle } from '../services/adminVehicleService'
import { VEHICLE_STATUS } from '../utils/vehicleStatuses'

export function AdminVehicleDetailPage({ id, navigate }) {
  const deactivationChoiceRef = useRef(null)
  const deactivationTriggerRef = useRef(null)
  const { token } = useAuth()
  const { applyUpdate, error, isLoading, reload, vehicle } = useAdminVehicle(id, token)
  const [deactivation, setDeactivation] = useState({ confirming: false, error: null, loading: false, saved: false })

  useEffect(() => {
    if (deactivation.confirming) deactivationChoiceRef.current?.focus()
  }, [deactivation.confirming])

  function closeDeactivation() {
    setDeactivation({ confirming: false, error: null, loading: false, saved: false })
    requestAnimationFrame(() => deactivationTriggerRef.current?.focus())
  }

  async function deactivate() {
    setDeactivation({ confirming: true, error: null, loading: true, saved: false })
    try {
      const updatedVehicle = await deactivateAdminVehicle(id, token)
      applyUpdate(updatedVehicle && typeof updatedVehicle === 'object'
        ? updatedVehicle
        : { status: VEHICLE_STATUS.INACTIVE })
      setDeactivation({ confirming: false, error: null, loading: false, saved: true })
    } catch (requestError) {
      setDeactivation({ confirming: true, error: requestError, loading: false, saved: false })
    }
  }

  if (isLoading && !vehicle) return <div className='container detail-state'><Loading message='Cargando vehículo...' /></div>
  if (error) return <div className='container detail-state'><ErrorMessage error={error} message='No fue posible consultar la información administrativa de este vehículo.' onRetry={reload} title='No pudimos cargar el vehículo' /></div>
  if (!vehicle) return <div className='container detail-state'><ErrorMessage message='El servidor respondió sin los datos solicitados.' onRetry={reload} title='No recibimos el vehículo' /></div>

  return (
    <section className='account-page' aria-busy={isLoading}><div className='container'>
      <Link className='detail-back' navigate={navigate} to='/admin/vehiculos'>Volver a vehículos</Link>
      <div className='account-card'>
        <p className='eyebrow'>Administración</p>
        <h1>Editar {vehicle.brand} {vehicle.model}</h1>
        <AdminVehicleForm disabled={isLoading || deactivation.loading} initialValues={vehicle} onSaved={applyUpdate} onSubmit={(changes) => updateAdminVehicle(id, changes, token)} successMessage='Vehículo actualizado correctamente.' />
        {deactivation.saved && <p className='success-message' role='status'>Vehículo desactivado correctamente.</p>}
        {vehicle.status !== VEHICLE_STATUS.INACTIVE && (
          <div>
            <AuthMessage error={deactivation.error} />
            {!deactivation.confirming ? (
              <button ref={deactivationTriggerRef} className='danger-link' type='button' disabled={isLoading} onClick={() => setDeactivation({ confirming: true, error: null, loading: false, saved: false })}>Desactivar vehículo</button>
            ) : (
              <div className='cancel-confirmation' role='group' aria-label='Confirmar desactivación' aria-busy={deactivation.loading}>
                <span>¿Confirmas la desactivación?</span>
                <button ref={deactivationChoiceRef} type='button' disabled={deactivation.loading} onClick={closeDeactivation}>No</button>
                <button type='button' disabled={deactivation.loading} onClick={deactivate}>{deactivation.loading ? 'Desactivando...' : 'Sí, desactivar'}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div></section>
  )
}
