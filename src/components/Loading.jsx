export function Loading({ message = 'Cargando contenido...' }) {
  return (
    <div className='state-panel' role='status' aria-live='polite' aria-atomic='true'>
      <span className='loader' aria-hidden='true' />
      <p>{message}</p>
    </div>
  )
}
