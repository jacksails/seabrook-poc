import { z } from 'zod'

export const FlavourSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  zone: z.object({
    x: z.number(), // pitch coordinate (0-1, low to high)
    y: z.number(), // volume coordinate (0-1, quiet to loud)
  }),
  imageUrl: z.string(),
  rumbleDescription: z.string(),
})

export type Flavour = z.infer<typeof FlavourSchema>

export const seabrookFlavours: Flavour[] = [
  {
    id: 'beefy',
    name: 'Beefy',
    description: 'Rich, meaty flavour that satisfies the deepest hungers. Britain\'s original crinkle cut with bold, hearty taste.',
    zone: { x: 0.2, y: 0.8 }, // Low pitch, High volume
    imageUrl: '/beefy.jpg',
    rumbleDescription: 'We heard a deep, growly rumble... it\'s gotta be BEEFY! 🥩'
  },
  {
    id: 'prawn-cocktail',
    name: 'Prawn Cocktail',
    description: 'Tangy seafood sensation with a cocktail twist. A Yorkshire favourite since 1979.',
    zone: { x: 0.8, y: 0.2 }, // High pitch, Low volume
    imageUrl: '/prawn-cocktail.jpg',
    rumbleDescription: 'That delicate, high-pitched tummy whisper calls for PRAWN COCKTAIL! 🦐'
  },
  {
    id: 'cheese-onion',
    name: 'Cheese & Onion',
    description: 'Classic combination of sharp cheese and caramelised onion. Brilliant by the bagful.',
    zone: { x: 0.5, y: 0.5 }, // Mid pitch, Mid volume
    imageUrl: '/cheese-onion.jpg',
    rumbleDescription: 'A perfectly balanced rumble demands the classic CHEESE & ONION! 🧀'
  },
  {
    id: 'sea-salt-vinegar',
    name: 'Sea Salt & Vinegar',
    description: 'Sharp, tangy punch with proper sea salt. The bold taste of the UK\'s number 1 crinkle cut crisp.',
    zone: { x: 0.8, y: 0.8 }, // High pitch, High volume
    imageUrl: '/salt-vinegar.jpg',
    rumbleDescription: 'That loud, sharp stomach shriek screams SEA SALT & VINEGAR! ⚡'
  },
  {
    id: 'sea-salted',
    name: 'Sea Salted',
    description: 'Simple, pure potato perfection with natural sea salt. Made from potatoes grown within 50 miles of Bradford.',
    zone: { x: 0.2, y: 0.2 }, // Low pitch, Low volume
    imageUrl: '/sea-salted.webp',
    rumbleDescription: 'A gentle, subtle rumble suggests you\'re a SEA SALTED purist! 🥔'
  },
]

// Function to find the closest flavour based on audio coordinates
export function findClosestFlavour(pitch: number, volume: number): Flavour {
  let closestFlavour = seabrookFlavours[0]
  let minDistance = Number.MAX_VALUE

  for (const flavour of seabrookFlavours) {
    const distance = Math.sqrt(
      Math.pow(pitch - flavour.zone.x, 2) + 
      Math.pow(volume - flavour.zone.y, 2)
    )

    if (distance < minDistance) {
      minDistance = distance
      closestFlavour = flavour
    }
  }

  return closestFlavour
} 