import { useEffect, useRef } from 'react'
import { getErrorMessage } from '../utils/errorMessages'

export function AuthMessage({ error }) {
  const messageRef = useRef(null)

  useEffect(() => {
    if (error) messageRef.current?.focus()
  }, [error])

  if (!error) return null

  return (
    <div className="auth-message" ref={messageRef} role="alert" tabIndex="-1">
      <p>{getErrorMessage(error)}</p>
      {error.requestId && <small>Referencia: {error.requestId}</small>}
    </div>
  )
}
