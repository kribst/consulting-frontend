import type { Actualite } from '../types'

// Les actualités sont centralisées ici pour faciliter la modification par un non-développeur.
// `datePublication` et `heurePublication` sont volontairement séparées (AAAA-MM-JJ et HH:MM).
export const actualites: Actualite[] = [
  {
    id: 1,
    slug: 'signature-convention-partenariat',
    title: 'FALKAOH CONSULTING signe une convention de partenariat',
    category: 'Partenariat',
    datePublication: '2026-09-18',
    heurePublication: '09:30',
    image: '/images/cooperation.jpg',
    imageAlt: 'Signature d’une convention de partenariat',
    summary:
      'Le cabinet formalise un nouvel axe de collaboration avec plusieurs acteurs du développement économique.',
    content: [
      'FALKAOH CONSULTING a signé une convention de partenariat avec plusieurs structures d’accompagnement. Cette collaboration vise à renforcer l’offre de conseil proposée aux entreprises, aux organisations de la société civile et aux collectivités locales.',
      'La convention définit un cadre commun d’intervention : diagnostic, études de faisabilité, formation professionnelle et accompagnement à la performance organisationnelle. Chaque partie s’engage à mobiliser ses compétences et son réseau au bénéfice des bénéficiaires désignés.',
      '« Ce type d’accord montre que le conseil ne s’exerce pas de manière isolée. En mutualisant les expertises, nous améliorons la qualité de nos interventions et la pertinence des solutions proposées », indique la direction du cabinet.',
      'Les premiers ateliers sont prévus dans les semaines à venir. Les modalités d’inscription seront communiquées aux partenaires concernés.',
    ],
  },
  {
    id: 2,
    slug: 'formation-professionnelle-participants',
    title: 'Une nouvelle session de formation professionnelle',
    category: 'Formation',
    datePublication: '2026-09-05',
    heurePublication: '14:00',
    image: '/images/renforcement.jpg',
    imageAlt: 'Session de formation professionnelle',
    summary:
      'Le cabinet ouvre une nouvelle session destinée aux professionnels en activité.',
    content: [
      'FALKAOH CONSULTING ouvre les inscriptions d’une nouvelle session de formation professionnelle. Le programme couvre le management, le contrôle de gestion, la fiscalité et le développement organisationnel.',
      'La formation alterne apports théoriques, études de cas et travaux pratiques sur des situations professionnelles réelles. Les participants disposent d’un support écrit et d’un suivi individualisé après la session.',
      'Les inscriptions sont ouvertes aux salariés, aux dirigeants et aux porteurs de projet. Les demandes sont à adresser au service commercial du cabinet.',
    ],
  },
  {
    id: 3,
    slug: 'etude-marche-secteur-agroalimentaire',
    title: 'Publication d’une étude de marché',
    category: 'Étude',
    datePublication: '2026-08-22',
    heurePublication: '10:15',
    image: '/images/commerce.jpg',
    imageAlt: 'Analyse de marché en cours',
    summary:
      'Les résultats de notre étude sur le secteur agroalimentaire sont désormais disponibles.',
    content: [
      'Notre équipe vient de finaliser une étude de marché consacrée au secteur agroalimentaire au Cameroun. Le travail a été mené auprès d’un échantillon d’acteurs de la filière, de distributeurs et de consommateurs.',
      'L’étude présente la structure de l’offre, les canaux de distribution, les attentes des acheteurs et les perspectives de développement. Elle formule également des recommandations opérationnelles pour les entreprises de la filière.',
      'Le rapport complet est remis aux clients concernés. Une synthèse peut être communiquée sur demande aux organisations qui souhaitent prendre connaissance de cette étude.',
    ],
  },
]