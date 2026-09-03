import { addDateInputDays, formatDateInput } from '../utils/formatters'
import { TRANSMISSIONS, TRANSMISSION_LABELS } from '../utils/transmissions'

export function VehicleFilters({ filters, onChange, onClear }) {
  function handleChange(event) {
    const { name, value } = event.target
    onChange({
      ...filters,
      [name]: value,
      ...(name === 'startDate' && (!value || filters.endDate <= value) && { endDate: '' }),
    })
  }

  const minimumDate = formatDateInput()
  const minimumEndDate = addDateInputDays(filters.startDate || minimumDate, 1)

  return (
    <form className="vehicle-filters vehicle-filters--compact" onSubmit={(event) => event.preventDefault()}>
      <div className="form-field">
        <label htmlFor="category">Categoría</label>
        <input
          id="category"
          name="category"
          type="search"
          value={filters.category}
          placeholder="Ej. SUV"
          onChange={handleChange}
        />
      </div>
      <div className="form-field">
        <label htmlFor="catalog-start-date">Recogida</label>
        <input id="catalog-start-date" min={minimumDate} name="startDate" type="date" value={filters.startDate} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="catalog-end-date">Devolución</label>
        <input id="catalog-end-date" min={minimumEndDate} name="endDate" type="date" value={filters.endDate} disabled={!filters.startDate} onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="transmission">Transmisión</label>
        <select id="transmission" name="transmission" value={filters.transmission} onChange={handleChange}>
          <option value="">Todas</option>
          {TRANSMISSIONS.map((transmission) => <option key={transmission} value={transmission}>{TRANSMISSION_LABELS[transmission]}</option>)}
        </select>
      </div>
      <button
        className="button button--ghost filter-clear"
        type="button"
        disabled={Object.values(filters).every((value) => !value)}
        onClick={onClear}
      >
        Limpiar
      </button>
    </form>
  )
}
