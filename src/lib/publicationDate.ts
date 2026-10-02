const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/**
 * Formate une date de publication `AAAA-MM-JJ` en libellé lisible
 * (ex. « 18 septembre 2026 »). L'heure reste formatée séparément.
 */
export function formatPublicationDate(datePublication: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePublication.trim())
  if (!match) return datePublication

  const [, year, month, day] = match
  return dateFormatter.format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))))
}

/** Formate une heure de publication `HH:MM` en libellé lisible (ex. « 09:30 »). */
export function formatPublicationTime(heurePublication: string): string {
  return heurePublication.trim()
}