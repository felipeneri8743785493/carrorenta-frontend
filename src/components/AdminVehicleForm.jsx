import { useState } from 'react'
import { VEHICLE_STATUSES, VEHICLE_STATUS_LABELS } from '../utils/vehicleStatuses'
import { AuthMessage } from './AuthMessage'

const fields = [
  { name: 'brand', label: 'Marca', type: 'text', maxLength: 100 },
  { name: 'model', label: 'Modelo', type: 'text', maxLength: 100 },
  { name: 'year', label: 'Año', type: 'number', min: 1886, max: 2147483647 },
  { name: 'category', label: 'Categoría', type: 'text', maxLength: 50 },
  { name: 'transmission', label: 'Transmisión', type: 'text', maxLength: 30 },
  { name: 'seats', label: 'Asientos', type: 'number', min: 1, max: 2147483647, step: 1 },
  { name: 'pricePerDay', label: 'Precio por día', type: 'number', min: 0.01, max: 99999999.99, step: 0.01 },
  { name: 'image', label: 'URL de imagen', type: 'url' },
]
const emptyVehicle = { brand: '', model: '', year: '', category: '', transmission: '', seats: '', pricePerDay: '', image: '', description: '', status: 'AVAILABLE' }
const editableFields = [...fields.map(({ name }) => name), 'description', 'status']
const numericFields = new Set(['year', 'seats', 'pricePerDay'])
const requiredTextFields = ['brand', 'model', 'category', 'transmission']

function getEditableValues(values = {}) {
  return Object.fromEntries(editableFields.map((name) => [
    name,
    name === 'image'
      ? values.image ?? values.imageUrl ?? emptyVehicle.image
      : values[name] ?? emptyVehicle[name],
  ]))
}

function createPayload(values) {
  return Object.fromEntries(editableFields.map((name) => [
    name,
    numericFields.has(name)
      ? Number(values[name])
      : typeof values[name] === 'string' ? values[name].trim() : values[name],
  ]))
}

function getRequiredTextError(values) {
  const emptyField = fields.find(({ name }) => (
    requiredTextFields.includes(name) && !String(values[name] ?? '').trim()
  ))
  return emptyField ? `${emptyField.label} no puede contener solo espacios.` : ''
}

export function AdminVehicleForm({ disabled = false, initialValues = emptyVehicle, onSaved, onSubmit, successMessage }) {
  const [savedValues, setSavedValues] = useState(() => getEditableValues(initialValues))
  const [changes, setChanges] = useState({})
  const [result, setResult] = useState({ error: null, saved: false, saving: false })
  const form = { ...savedValues, ...changes }
  const normalizedForm = createPayload(form)
  const normalizedSavedValues = createPayload(savedValues)
  const hasChanges = editableFields.some((name) => (
    String(normalizedForm[name]) !== String(normalizedSavedValues[name])
  ))

  function change(event) {
    setResult((current) => ({ ...current, saved: false }))
    setChanges((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    const textError = getRequiredTextError(form)
    if (textError) {
      setResult({ error: new Error(textError), saved: false, saving: false })
      return
    }
    setResult({ error: null, saved: false, saving: true })
    try {
      const payload = normalizedForm
      const saved = await onSubmit(payload)
      const nextValues = getEditableValues({
        ...payload,
        ...(saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {}),
      })
      setSavedValues(nextValues)
      setChanges({})
      onSaved?.(nextValues)
      setResult({ error: null, saved: true, saving: false })
    } catch (error) {
      setResult({ error, saved: false, saving: false })
    }
  }

  return (
    <form className='auth-form auth-form--grid' aria-busy={result.saving || disabled} onSubmit={submit}>
      {fields.map(({ label, name, ...inputProps }) => (
        <div className='form-field' key={name}>
          <label htmlFor={`vehicle-${name}`}>{label}</label>
          <input
            {...inputProps}
            id={`vehicle-${name}`}
            disabled={result.saving || disabled}
            name={name}
            required={name !== 'image'}
            value={form[name]}
            onChange={change}
          />
        </div>
      ))}
      <div className='form-field'>
        <label htmlFor='vehicle-status'>Estado</label>
        <select id='vehicle-status' name='status' value={form.status} disabled={result.saving || disabled} onChange={change}>
          {VEHICLE_STATUSES.map((status) => <option key={status} value={status}>{VEHICLE_STATUS_LABELS[status]}</option>)}
        </select>
      </div>
      <div className='form-field'>
        <label htmlFor='vehicle-description'>Descripción</label>
        <textarea id='vehicle-description' name='description' rows='5' value={form.description} disabled={result.saving || disabled} onChange={change} />
      </div>
      <AuthMessage error={result.error} />
      {result.saved && <p className='success-message' role='status'>{successMessage}</p>}
      <button className='button button--primary' disabled={result.saving || disabled || !hasChanges} type='submit'>
        {result.saving || disabled ? 'Actualizando...' : hasChanges ? 'Guardar' : 'Sin cambios'}
      </button>
    </form>
  )
}
