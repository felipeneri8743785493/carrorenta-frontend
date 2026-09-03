import vehicle01 from '../assets/vehicles/vehicle-01.jpg'
import vehicle02 from '../assets/vehicles/vehicle-02.webp'
import vehicle03 from '../assets/vehicles/vehicle-03.jpg'
import vehicle04 from '../assets/vehicles/vehicle-04.jpg'
import { getEntityId } from './identifiers'

const demoVehicleImages = [vehicle01, vehicle02, vehicle03, vehicle04]

function getImageCandidates(vehicle) {
  const images = Array.isArray(vehicle?.images) ? vehicle.images : []
  return [vehicle?.imageUrl, vehicle?.image, ...images].filter((image) => (
    typeof image === 'string' && image.trim()
  ))
}

function getVehicleIdentity(vehicle) {
  return String(
    getEntityId(vehicle)
    ?? [vehicle?.brand, vehicle?.make, vehicle?.model, vehicle?.year].filter(Boolean).join('-')
    ?? 'vehicle',
  )
}

function hashIdentity(identity) {
  return [...identity].reduce(
    (hash, character) => ((hash * 31) + character.codePointAt(0)) >>> 0,
    0,
  )
}

export function resolveVehicleImages(vehicle) {
  const backendImages = [...new Set(getImageCandidates(vehicle))]
  const imageIndex = hashIdentity(getVehicleIdentity(vehicle)) % demoVehicleImages.length
  const fallbackImage = demoVehicleImages[imageIndex]

  return {
    fallbackImage,
    images: backendImages.length ? backendImages : [fallbackImage],
    isDemo: backendImages.length === 0,
  }
}
