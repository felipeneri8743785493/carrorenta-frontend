export function FormField({
  autoComplete,
  error,
  inputRef,
  label,
  name,
  onChange,
  required = false,
  type = 'text',
  value,
  ...inputProps
}) {
  const errorId = `${name}-error`

  return (
    <div className="form-field auth-field">
      <label htmlFor={name}>{label}</label>
      <input
        {...inputProps}
        id={name}
        ref={inputRef}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        required={required}
        onChange={onChange}
      />
      {error && <span id={errorId} className="field-error" role="alert">{error}</span>}
    </div>
  )
}
