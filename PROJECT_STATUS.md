# Project Status Report — MARBRERIE TUNIS CARTHAGE (MTC)

**Generated:** September 14, 2026  
**Status:** Read-Only Verification & Comprehensive Codebase Audit  

---

## 1. Full File Structure

### `src/` Directory Tree

```
src/
├── app/
│   ├── [locale]/
│   │   ├── a-propos/
│   │   │   └── page.tsx
│   │   ├── catalogue/
│   │   │   └── page.tsx
│   │   ├── configurateur-3d/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── devis/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── produits/
│   │   │   └── page.tsx
│   │   ├── projets/
│   │   │   └── page.tsx
│   │   └── usine/
│   │       └── page.tsx
│   ├── actions/
│   │   └── submitDevis.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── common/
│   │   ├── ComingSoon.tsx
│   │   └── FadeInSection.tsx
│   ├── devis/
│   │   └── DevisForm.tsx
│   ├── home/
│   │   ├── ConfiguratorPopup.tsx
│   │   ├── ConfiguratorTeaser.tsx
│   │   ├── Hero.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── ProductsCataloguePopup.tsx
│   │   ├── ProductsPreview.tsx
│   │   ├── ProjetsCataloguePopup.tsx
│   │   ├── ProjetsShowcase.tsx
│   │   ├── UsineCataloguePopup.tsx
│   │   ├── UsineShowcase.tsx
│   │   └── VideoShowcase.tsx
│   └── layout/
│       ├── FloatingSocialBar.tsx
│       ├── Footer.tsx
│       ├── LanguageSwitcher.tsx
│       └── Navbar.tsx
├── data/
│   ├── configuratorRooms.ts
│   ├── productTypes.ts
│   ├── products.ts
│   ├── projects.ts
│   ├── siteConfig.ts
│   ├── testimonials.ts
│   └── usine.ts
├── lib/
│   ├── email/
│   │   └── templates.ts
│   ├── i18n/
│   │   ├── dictionaries/
│   │   │   ├── en.json
│   │   │   └── fr.json
│   │   ├── request.ts
│   │   └── routing.ts
│   └── validations/
│       └── devisSchema.ts
├── middleware.ts
└── types/
    └── content.ts
```

### `public/` Directory (Filenames Only)

- `0.jpg` (Stock marble / factory image)
- `00.jpg` (Stock marble / factory image)
- `1.jpg` (Stock marble / interior image)
- `2.jpg` (Stock marble / interior image)
- `3.jpg` (Stock marble / interior image)
- `4.jpg` (Stock marble / interior image)
- `Bank de Tunisie.jpg` (Client partner logo)
- `attijeri.png` (Attijari Bank partner logo)
- `biat.png` (BIAT partner logo)
- `logo.png` (Company logo)
- `uib.png` (UIB partner logo)

---

## 2. Homepage Sections — Current State

The homepage is rendered by `src/app/[locale]/page.tsx` (wrapped by `src/app/[locale]/layout.tsx` providing `Navbar`, `FloatingSocialBar`, and `Footer`). Inside `page.tsx`, components are rendered in the following exact order:

1. **`LoadingScreen`** (`src/components/home/LoadingScreen.tsx`)  
   Displays an initial full-screen loading overlay on first visit per session with the brand logo, a CSS spinner, progress bar, and a 0–100% GSAP animated counter; records completion in `sessionStorage`.

2. **`Hero`** (`src/components/home/Hero.tsx`)  
   Full-screen hero section featuring an automatic 5-second image crossfade carousel (`/1.jpg`, `/2.jpg`, `/3.jpg`, `/4.jpg`), GSAP staggered entrance typography, a CTA button linking to `#produits`, and an animated bounce scroll indicator.

3. **`VideoShowcase`** [wrapped in `FadeInSection`] (`src/components/home/VideoShowcase.tsx`)  
   Embeds an asynchronous 16:9 YouTube video player via the YouTube IFrame API that auto-plays/pauses on viewport intersection using `IntersectionObserver`, complete with a custom floating mute/unmute toggle.

4. **`UsineShowcase`** [wrapped in `FadeInSection`] (`src/components/home/UsineShowcase.tsx`)  
   Showcases the factory facilities with an auto-cycling 4-image carousel (`/0.jpg`, `/00.jpg`, `/1.jpg`, `/2.jpg`), GSAP ScrollTrigger text animations, and an interactive button that triggers the `UsineCataloguePopup` modal.

5. **`ProductsPreview`** [contains internal `FadeInSection`] (`src/components/home/ProductsPreview.tsx`)  
   Presents a parallax-backed marble teaser section (`/0.jpg`) with localized headline copy and a primary button that opens the `ProductsCataloguePopup` modal.

6. **`ConfiguratorTeaser`** [wrapped in `FadeInSection`] (`src/components/home/ConfiguratorTeaser.tsx`)  
   Displays a 3D configurator promo section with background image (`/00.jpg`), localized teaser copy, and a button opening the `ConfiguratorPopup` room selection modal.

7. **`ProjetsShowcase`** [wrapped in `FadeInSection`] (`src/components/home/ProjetsShowcase.tsx`)  
   Renders a portfolio teaser section with background image (`/3.jpg`), descriptive copy, and a button opening the `ProjetsCataloguePopup` modal.

---

## 3. Routes / Pages Status

| Route | File Path | Status | Details (Existing vs Missing) |
|---|---|---|---|
| `/` or `/[locale]` | `src/app/[locale]/page.tsx` | **Fully Built** | **Exists:** Complete landing page containing 7 sections (Loading, Hero, Video player, Factory teaser, Products preview, Configurator teaser, Projects showcase), GSAP/Framer-Motion animations, modal connectors, dynamic i18n metadata. |
| `/devis` | `src/app/[locale]/devis/page.tsx` | **Fully Built** | **Exists:** Complete customized quote request page with form validation (`react-hook-form` + `zod`), file attachment handling (PDF/JPG/PNG <= 10MB), honeypot anti-spam, and Server Action (`submitDevis`) with Resend and Vercel Blob integrations. |
| `/not-found` (404) | `src/app/[locale]/not-found.tsx` | **Fully Built** | **Exists:** Styled 404 page with localized messaging and a button returning to the homepage. |
| `/a-propos` | `src/app/[locale]/a-propos/page.tsx` | **Placeholder Only** | **Exists:** Renders `<ComingSoon />` component. **Missing:** Company history, mission, leadership, artisan team, and workshop storytelling content. |
| `/catalogue` | `src/app/[locale]/catalogue/page.tsx` | **Placeholder Only** | **Exists:** Renders `<ComingSoon />`. **Missing:** Standalone full-page product catalogue and filter system (catalogue is currently accessible only via popup modal on the homepage). |
| `/configurateur-3d` | `src/app/[locale]/configurateur-3d/page.tsx` | **Placeholder Only** | **Exists:** Renders `<ComingSoon />`. **Missing:** Full 3D interactive viewer/configurator engine (room selection currently exists in popup modal on the homepage). |
| `/contact` | `src/app/[locale]/contact/page.tsx` | **Placeholder Only** | **Exists:** Renders `<ComingSoon />`. **Missing:** Dedicated standalone contact page with interactive contact form, opening hours, and direct messaging channels (contact info currently in Footer). |
| `/produits` | `src/app/[locale]/produits/page.tsx` | **Placeholder Only** | **Exists:** Renders `<ComingSoon />`. **Missing:** Dedicated product listing page, category filters, and detail pages. |
| `/projets` | `src/app/[locale]/projets/page.tsx` | **Placeholder Only** | **Exists:** Renders `<ComingSoon />`. **Missing:** Dedicated project portfolio grid, case study breakdowns, and client categories (portfolio currently viewed in popup modal on homepage). |
| `/usine` | `src/app/[locale]/usine/page.tsx` | **Placeholder Only** | **Exists:** Renders `<ComingSoon />`. **Missing:** Dedicated factory page with machinery breakdowns, virtual tour, and technical specifications (currently viewed in popup modal on homepage). |

---

## 4. Dependencies Installed

From `package.json`:

### `dependencies`
- `@hookform/resolvers`: `^5.9.1`
- `@vercel/blob`: `^2.8.0`
- `framer-motion`: `^12.4.7`
- `gsap`: `^3.12.7`
- `next`: `^15.2.0`
- `next-intl`: `^3.26.5`
- `react`: `^19.0.0`
- `react-dom`: `^19.0.0`
- `react-hook-form`: `^7.88.0`
- `resend`: `^6.28.0`
- `zod`: `^4.6.5`

### `devDependencies`
- `@eslint/eslintrc`: `^3`
- `@tailwindcss/postcss`: `^4`
- `@types/node`: `^20`
- `@types/react`: `^19`
- `@types/react-dom`: `^19`
- `eslint`: `^9`
- `eslint-config-next`: `^15.2.0`
- `tailwindcss`: `^4`
- `typescript`: `^5`

---

## 5. Data Files

| File | Content Summary | Placeholder Entries / Notes |
|---|---|---|
| `src/data/configuratorRooms.ts` | Exports 4 room visualizer configurations (`kitchen`, `bathroom`, `livingRoom`, `furniture`) with localized names, descriptions, and feature bullet points, plus modal copy. | **4 entries**; all 4 use local stock photos (`/1.jpg`, `/4.jpg`, `/2.jpg`, `/3.jpg`) as placeholders awaiting final 3D room renders. |
| `src/data/productTypes.ts` | Exports enum values and label keys for marble product types (`marbre`, `granit`, `travertin`, `autre`) used in the quote request form. | **0 placeholder entries**; production configuration file for form select options. |
| `src/data/products.ts` | Exports an array of 16 marble/granite/travertine/onyx products with localized names, categories, tags, finishes, and descriptions. | **16 entries**; all 16 entries contain placeholder copy (`Lorem ipsum description placeholder, à remplacer par le client`) and 9 entries reference external `placehold.co` image URLs. |
| `src/data/projects.ts` | Exports an array of 16 architecture and interior projects across 3 categories (Résidentiel: 5, Commercial: 5, Hôtellerie: 6). | **16 entries**; all 16 entries contain placeholder copy (`Lorem ipsum, à remplacer par le client`) and use `placehold.co` URLs for multi-image details. |
| `src/data/siteConfig.ts` | Exports company metadata (names in FR/AR, founding year 1989, phone, email, address, WhatsApp prefill text, social links, and media asset paths). | Contains placeholder YouTube video ID (`r5NAR0xMqTc`), generic Google Maps iframe embed URL, and `#` placeholder links for Facebook, Instagram, YouTube, and LinkedIn. |
| `src/data/testimonials.ts` | Exports `trustedClients` array with 6 bank and corporate partner entries. | **6 entries** (4 local images `attijeri.png`, `biat.png`, `uib.png`, `Bank de Tunisie.jpg` + 2 `placehold.co` images). *Currently dead code (not imported or displayed anywhere in UI).* |
| `src/data/usine.ts` | Exports an array of 12 factory machines, workstations, and workshops across Découpe, Polissage, Manutention, and Atelier. | **12 entries**; all 12 contain placeholder descriptions (`Lorem ipsum, à remplacer par le client`) and `placehold.co` image URLs. |

---

## 6. Popup Components Status

| Component | File Path | Trigger / Wiring | Content & Behavior |
|---|---|---|---|
| **`ProductsCataloguePopup`** | `src/components/home/ProductsCataloguePopup.tsx` | Triggered by `<button>` in `src/components/home/ProductsPreview.tsx` (`onClick={() => setCatalogueOpen(true)}`). | **Exists & Fully Wired.** Renders an animated modal dialog (Framer Motion) containing a responsive 4-column grid of 16 product cards. Each card features an image carousel with swipe/button navigation, category badge, and title. Clicking a card expands it with LayoutGroup animations to show full description, finish details, and carousel controls. Dismissible via Escape key, overlay click, or close button with body scroll lock. |
| **`ProjetsCataloguePopup`** | `src/components/home/ProjetsCataloguePopup.tsx` | Triggered by `<button>` in `src/components/home/ProjetsShowcase.tsx` (`onClick={() => setCatalogueOpen(true)}`). | **Exists & Fully Wired.** Renders an animated modal dialog with a responsive grid of 16 portfolio projects. Features image carousels for each project and expandable card animations displaying full project descriptions. Dismissible via Escape key, backdrop click, or close button with body scroll lock. |
| **`UsineCataloguePopup`** | `src/components/home/UsineCataloguePopup.tsx` | Triggered by `<button>` in `src/components/home/UsineShowcase.tsx` (`onClick={() => setCatalogueOpen(true)}`). | **Exists & Fully Wired.** Renders an animated modal dialog showcasing 12 factory machines and workshops in an expandable responsive card grid with multi-photo carousels and detailed descriptions. Dismissible via Escape, backdrop, or close button with body scroll lock. |
| **`ConfiguratorPopup`** | `src/components/home/ConfiguratorPopup.tsx` | Triggered by `<button>` in `src/components/home/ConfiguratorTeaser.tsx` (`onClick={() => setPopupOpen(true)}`). | **Exists & Fully Wired.** Renders a dark-themed modal dialog presenting 4 room category cards (`Cuisine`, `Salle de Bain`, `Salon`, `Tables & Mobilier`) with hover zoom and bullet points. Clicking a room card triggers a smooth view transition showing the selected room confirmation state and a notice that the 3D tool is coming soon. |

---

## 7. Known Issues or Incomplete Patterns

1. **TypeScript Type Mismatches in Devis Form (`npx tsc --noEmit` fails):**
   - In `src/components/devis/DevisForm.tsx`: `useForm<DevisFormValues>` default value for `productType` is set to `""` (empty string), but `DevisFormValues` schema expects `"marbre" | "granit" | "travertin" | "autre"`. This produces TS2322 and TS2345 type errors when building with strict type checking.
   - In `src/lib/validations/devisSchema.ts`: `parseDevisFormData` returns `productType: String(...)` which is inferred as `string` rather than `ProductTypeValue`.

2. **Dead / Unused Code:**
   - **`src/data/testimonials.ts` (`trustedClients`)**: This dataset is defined but never imported or rendered in any component.
   - **`trusted` Translation Namespace**: In `fr.json` and `en.json`, the `"trusted"` object (`"title": "Ils nous ont fait confiance"`) is never referenced.
   - **`NavItem` Type**: Defined in `src/types/content.ts` but never imported or used.
   - **Unused Product Translation Keys**: `fr.json` and `en.json` contain `products.items`, and `en.json` contains `products.details`, but all product catalogue components read localized text directly from `src/data/products.ts`.
   - **Translation Discrepancy**: `en.json` contains a large `products.details` object that is absent in `fr.json`.
   - **Configurator Room ID Mismatch in Dictionaries**: `fr.json` and `en.json` define room keys `kitchen`, `bathroom`, `livingRoom`, `table` under `configurator.popup.rooms`, whereas `configuratorRooms.ts` uses room ID `furniture` (the popups bypass this dictionary and use data object fields directly).

3. **Navigation vs Route Inconsistencies:**
   - On the `Navbar` (`src/components/layout/Navbar.tsx`), links for *Usine*, *Produits*, *Configurateur*, and *Projets* are anchor links pointing to `#usine`, `#produits`, `#configurateur`, `#projets` on the homepage.
   - In the `Footer` (`src/components/layout/Footer.tsx`), the same items link to standalone routes `/usine`, `/produits`, `/configurateur-3d`, `/projets`, which currently only display placeholder `<ComingSoon />` pages.

4. **Placeholder Media and Links:**
   - Social links in `src/data/siteConfig.ts` are set to `#` placeholders.
   - YouTube video ID in `src/data/siteConfig.ts` is set to a placeholder ID (`r5NAR0xMqTc`).
   - Multiple `// SWAP:` comments remain in `siteConfig.ts`, `products.ts`, `projects.ts`, `usine.ts`, `testimonials.ts`, `configuratorRooms.ts`, `Footer.tsx`, `LoadingScreen.tsx`, and `ConfiguratorTeaser.tsx`.

---

## 8. Environment / Configuration

- **`.env.local`**: Does **NOT** exist in the workspace.
- **`.env.local.example`**: **Exists** at the project root with the following template keys:
  - `RESEND_API_KEY`: API key required for sending transactional emails (quote requests and client confirmations) via Resend.
  - `BLOB_READ_WRITE_TOKEN`: Read/write access token required for uploading file attachments (PDF/JPG/PNG) to `@vercel/blob` storage.

---

## 9. Git Status

- **Version Control:** Active (Git)
- **Current Branch:** `main`
- **Upstream Tracking:** Branch is ahead of `origin/main` by 1 commit.
- **Working Tree:** Clean prior to report creation (only `PROJECT_STATUS.md` added).
