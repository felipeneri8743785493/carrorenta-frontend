export function EmptyState({
  actionLabel = 'Limpiar filtros',
  headingLevel = 2,
  message = 'Prueba con otros filtros para ampliar los resultados.',
  onAction,
  title = 'No encontramos vehículos',
}) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2'

  return (
    <div className="state-panel" role="status">
      <span className="state-panel__icon" aria-hidden="true">⌕</span>
      <Heading>{title}</Heading>
      {message && <p>{message}</p>}
      {onAction && (
        <button className="button button--ghost" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
