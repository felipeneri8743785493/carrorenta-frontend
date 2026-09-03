const messages = Object.freeze({
  'Invalid email or password': 'El correo o la contraseña son incorrectos.',
  'Email is already registered': 'Ya existe una cuenta con este correo electrónico.',
  'Current password is incorrect': 'La contraseña actual es incorrecta.',
  'New password must be different from current password': 'La nueva contraseña debe ser diferente de la actual.',
  'New password must contain at least 8 characters': 'La nueva contraseña debe contener al menos ocho caracteres.',
  'Vehicle is not available': 'El vehículo no está disponible.',
  'Vehicle is already reserved for those dates': 'El vehículo ya está reservado para esas fechas.',
  'Reservation cannot be cancelled in its current status': 'Esta reservación ya no se puede cancelar.',
  'Reservation status changed concurrently; retry': 'El estado de la reservación cambió. Actualiza la información e inténtalo nuevamente.',
  'Administrators cannot remove their own admin role': 'No puedes retirar tu propio rol de administrador.',
})

const statusMessages = Object.freeze({
  400: 'Revisa los datos ingresados e inténtalo nuevamente.',
  401: 'No fue posible validar tus credenciales.',
  403: 'Tu cuenta no tiene permiso para realizar esta acción.',
  404: 'La información solicitada ya no está disponible.',
  409: 'La operación entra en conflicto con el estado actual. Actualiza la información e inténtalo nuevamente.',
  413: 'La información enviada supera el tamaño permitido.',
  429: 'Se realizaron demasiadas solicitudes. Espera un momento e inténtalo nuevamente.',
  500: 'El servidor tuvo un problema. Inténtalo nuevamente más tarde.',
})

export function getErrorMessage(error, fallback = 'No fue posible completar la solicitud.') {
  const message = typeof error?.message === 'string' ? error.message : ''
  if (messages[message]) return messages[message]
  if (!error?.status && message) return message
  if (error?.status >= 500) return statusMessages[500]
  return statusMessages[error?.status] ?? fallback
}
