import { useState } from 'react'

export function VehicleGallery({ fallbackImage, images, isDemo = false, vehicleName }) {
  const validImages = [...new Set(images.filter((image) => (
    typeof image === 'string' && image.trim()
  )))]
  const [failedImages, setFailedImages] = useState(() => new Set())
  const [fallbackFailed, setFallbackFailed] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const availableImages = validImages.filter((image) => !failedImages.has(image))
  const hasBackendImage = !isDemo && availableImages.length > 0
  const showingDemo = !hasBackendImage
  const selectedImage = availableImages[selectedIndex]
    ?? availableImages[0]
    ?? (fallbackFailed ? null : fallbackImage)

  function markAsFailed(image) {
    if (image === fallbackImage) {
      setFallbackFailed(true)
      return
    }
    setFailedImages((current) => new Set(current).add(image))
    setSelectedIndex(0)
  }

  return (
    <div className="vehicle-gallery">
      <div className="vehicle-gallery__main">
        <span aria-hidden="true">CR</span>
        {selectedImage && (
          <img
            src={selectedImage}
            alt={showingDemo
              ? `Imagen de demostración para ${vehicleName}`
              : `${vehicleName}, imagen ${selectedIndex + 1}`}
            decoding="async"
            fetchPriority="high"
            referrerPolicy="no-referrer"
            onError={() => markAsFailed(selectedImage)}
          />
        )}
        {showingDemo && selectedImage && <span className='vehicle-image-note'>Imagen de demostración</span>}
      </div>
      {availableImages.length > 1 && (
        <div className="vehicle-gallery__thumbnails" aria-label="Imágenes del vehículo">
          {availableImages.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Ver imagen ${index + 1}`}
              aria-pressed={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
            >
              <img src={image} alt="" decoding="async" loading="lazy" referrerPolicy="no-referrer" onError={() => markAsFailed(image)} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
