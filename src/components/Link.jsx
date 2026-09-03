export function Link({ children, className, navigate, state, to, ...props }) {
  function handleClick(event) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return

    event.preventDefault()
    navigate(to, { state })
  }

  return (
    <a {...props} className={className} href={to} onClick={handleClick}>
      {children}
    </a>
  )
}
