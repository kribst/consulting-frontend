# FALKAOH CONSULTING Frontend

React + TypeScript + Vite + Tailwind CSS.

```bash
npm install
npm run dev
```

Par défaut, `VITE_USE_BACKEND=false`, donc le formulaire et l’admin utilisent des données mock locales.

## UX / contenu modifiable

- Logo : `public/logo-cps-rabat.svg` et `public/logo-cps-rabat-light.svg`
- Illustration hero sans arrière-plan : `public/images/hero-consulting-illustration.svg`
- Informations CPS, Google Maps, téléphone, WhatsApp, email et liens sociaux : `src/data/company.ts`
- Services : `src/data/services.ts`
- Couleurs : `tailwind.config.js` et `src/index.css`

## Motion / animations

Les animations sont légères et adaptées à un site corporate : micro-interactions, scroll reveal, stagger cards, navbar sticky animée, counters, drawer mobile, skeleton loading, feedback de formulaire et illustration hero animée.

Fichiers principaux :

```txt
src/index.css
src/components/motion/Reveal.tsx
src/components/motion/AnimatedCounter.tsx
src/router/ScrollToTop.tsx
```

Le projet utilise Tailwind CSS `3.4.17` pour rester compatible avec `postcss.config.js` et éviter l'erreur Tailwind v4 `@tailwindcss/postcss`.

Les icônes modernes viennent de `lucide-react`.


## Mini CMS admin

Route admin : `/admin/contenu`.

Cette page permet de modifier les informations société, les services, les statistiques, les témoignages, le processus et les champs SEO.

- Mock mode : sauvegarde dans `localStorage`.
- Backend mode : sauvegarde via `/api/admin/site-content`.

Fichiers principaux :

```txt
src/features/content/SiteContentContext.tsx
src/features/content/siteContentStorage.ts
src/pages/admin/AdminContentPage.tsx
src/components/ui/PageMeta.tsx
public/robots.txt
public/sitemap.xml
```