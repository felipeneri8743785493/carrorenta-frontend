export function Pagination({ currentPage, label = 'Paginación', onPageChange, totalPages }) {
  if (totalPages <= 1) return null

  return (
    <nav className='pagination' aria-label={label}>
      <button type='button' disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        <span aria-hidden='true'>←</span> Anterior
      </button>
      <p aria-live='polite'>Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></p>
      <button type='button' disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Siguiente <span aria-hidden='true'>→</span>
      </button>
    </nav>
  )
}
