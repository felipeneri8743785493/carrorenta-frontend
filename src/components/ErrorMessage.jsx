export function ErrorMessage({
  error,
  message,
  onRetry,
  title,
}) {
  const status = error?.status
  const codePresentation = {
    NETWORK_ERROR: {
      title: 'Sin conexión con el servidor',
      message: error?.message,
    },
    REQUEST_TIMEOUT: {
      title: 'El servidor tardó demasiado',
      message: error?.message,
    },
    API_CONFIG_ERROR: {
      title: 'Configuración de API inválida',
      message: error?.message,
    },
  }[error?.code]
  const presentation = codePresentation ?? ({
    403: {
      title: 'No tienes permiso para continuar',
      message: 'Tu cuenta no puede acceder a esta información.',
    },
    404: {
      title: 'No encontramos el recurso',
      message: 'Es posible que se haya eliminado o cambiado de ubicación.',
    },
    429: {
      title: 'Demasiadas solicitudes',
      message: 'Espera un momento antes de intentarlo nuevamente.',
    },
  }[status])
  const isServerError = status >= 500
  const resolvedTitle = presentation?.title
    ?? (isServerError ? 'El servicio no está disponible' : title)
    ?? 'No pudimos completar la solicitud'
  const resolvedMessage = presentation?.message
    ?? (isServerError ? 'El servidor tuvo un problema. Inténtalo nuevamente más tarde.' : message)
    ?? 'Verifica tu conexión e inténtalo nuevamente.'
  const canRetry = onRetry && status !== 403 && status !== 404
    && error?.code !== 'API_CONFIG_ERROR'

  return (
    <div className='state-panel state-panel--error' role='alert'>
      <span className='state-panel__icon' aria-hidden='true'>!</span>
      <h2>{resolvedTitle}</h2>
      <p>{resolvedMessage}</p>
      {error?.requestId && <p className='request-id'>Referencia: {error.requestId}</p>}
      {canRetry && <button className='button button--primary' type='button' onClick={onRetry}>Reintentar</button>}
    </div>
  )
}
