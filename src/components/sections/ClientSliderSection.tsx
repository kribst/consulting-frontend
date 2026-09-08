import React from 'react'
import { Reveal } from '../motion/Reveal'

interface ClientLogo {
  src: string
  alt: string
  className?: string
}

interface ClientSliderSectionProps {
  logos?: ClientLogo[]
  size?: 'sm' | 'md' | 'lg' | 'xl'
  // paddingY: valeur CSS pour padding-top et padding-bottom (ex: '12px', '1rem')
  // Si non fournie, la classe globale `.client_logo_area` garde son padding par défaut.
  paddingY?: string
}

const defaultLogos: ClientLogo[] = [
  { src: '/images/LOGO_ASAPROC1.png', alt: 'ASAPROCE' },
  { src: '/images/LOGO_ASAPROCE2.png', alt: 'ASAPROCE' },
  { src: '/images/LOGO_ASAPROCE__3.png', alt: 'ASAPROCE' },
]

/*
|--------------------------------------------------------------------------
| 🔴 MODIFIER LA TAILLE DES LOGOS ICI
|--------------------------------------------------------------------------
|
| h = hauteur
| w = largeur
|
| Exemple :
| h-40 w-40 = 160 x 160 px
| h-48 w-48 = 192 x 192 px
| h-56 w-56 = 224 x 224 px
| h-64 w-64 = 256 x 256 px
|
| md:h-48 md:w-48 signifie :
| → 192 x 192 px sur les écrans moyens et grands
|
*/

const sizeClasses: Record<string, string> = {
  
  // 🟢 PETIT
  sm: 'h-24 w-24 p-2 md:h-28 md:w-28 md:p-3',

  // 🟡 MOYEN
  md: 'h-32 w-32 p-3 md:h-40 md:w-40 md:p-4',

  // 🟠 GRAND
  lg: 'h-40 w-40 p-4 md:h-48 md:w-48 md:p-5',

  // 🔴 TRÈS GRAND
  xl: 'h-48 w-48 p-5 md:h-56 md:w-56 md:p-6',
}

// Ajuste l'espacement entre les logos selon la taille choisie.
// On réduit l'espace quand les logos sont plus grands pour garder
// une mise en page compacte sans changer la taille des images.
const gapClasses: Record<string, string> = {
  sm: 'gap-8 md:gap-10',
  md: 'gap-6 md:gap-8',
  lg: 'gap-4 md:gap-6',
  xl: 'gap-2 md:gap-4',
}

export function ClientSliderSection({
  logos = defaultLogos,
  size = 'md',
  paddingY,
}: ClientSliderSectionProps) {
  return (
    <section className="client_logo_area bg-white border-0 my-0 py-0" style={paddingY ? { paddingTop: paddingY, paddingBottom: paddingY } : undefined}>
      <div className="container-page">
        <Reveal>

          <div className={`client_slider flex flex-wrap items-center justify-center ${gapClasses[size]}`}>

            {logos.map((logo, i) => (
              <div
                key={logo.alt || i}
                className={[
                  'client_slider_item',

                  'inline-flex',
                  'items-center',
                  'justify-center',

                  'rounded-full',

                  'bg-gray-50',
                  'border',
                  'border-gray-100',

                  'overflow-hidden',

                  'shadow-soft',

                  'transform',
                  'hover:scale-105',
                  'transition-transform',

                  /*
                  |--------------------------------------------------------------------------
                  | 🔴 LA TAILLE DU CERCLE EST CONTRÔLÉE ICI
                  |--------------------------------------------------------------------------
                  |
                  | sizeClasses[size] récupère la taille définie plus haut.
                  |
                  */
                  sizeClasses[size],
                ]
                  .filter(Boolean)
                  .join(' ')}
              >

                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={[
                    'client_slider_img',

                    /*
                    |--------------------------------------------------------------------------
                    | 🟢 L'IMAGE PREND TOUT L'ESPACE DU CERCLE
                    |--------------------------------------------------------------------------
                    |
                    | w-full = largeur 100%
                    | h-full = hauteur 100%
                    |
                    | ⚠️ Ne modifie pas ces valeurs pour augmenter la taille.
                    | La taille doit être modifiée dans "sizeClasses" ci-dessus.
                    |
                    */
                    'w-full',
                    'h-full',

                    /*
                    | Garde les proportions originales du logo.
                    */
                    'object-contain',

                    logo.className || '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />

              </div>
            ))}

          </div>

        </Reveal>
      </div>
    </section>
  )
}