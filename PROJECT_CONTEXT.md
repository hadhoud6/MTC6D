# PROJECT CONTEXT — MARBRERIE TUNIS CARTHAGE (MTC)

> **Document Version:** 1.0.0  
> **Last Updated:** October 8, 2026  
> **Workspace Path:** `/Users/hadhoud/Desktop/MTC`  
> **Target Audience:** AI Coding Assistants & New Engineering Contributors  

---

## 1. OVERVIEW

### 1.1 Project Summary
**MARBRERIE TUNIS CARTHAGE (MTC)** is a modern, high-end digital web platform for a luxury natural stone and marble manufacturer based in Carthage, Tunisia (established in 1989). The platform serves as an interactive showcase of artisanal stone craftsmanship, factory machinery, luxury stone collections, architectural project portfolios, and digital tools for prospective private and commercial clients.

### 1.2 Problems Solved
- **Showcase Artisanal & Industrial Mastery:** Demonstrates over 35 years of heritage, showcasing 5-axis CNC machining, diamond wire saws, surface polishing, and traditional stonecutting.
- **Client Acquisition & Streamlined Inquiries:** Offers a localized, structured quote request system (`/devis`) with architectural plan/file uploads (up to 30 MB) and automated dual-language email confirmations (client + factory workshop).
- **Direct Interactive Experience:** Provides an interactive digital PDF flipbook catalog with realistic page-turn physics and audio effects, full-screen snap panel storytelling on the homepage, and modal catalogs for immediate exploration.
- **Bi-lingual Audience:** Native bilingual support for French (`fr`, default) and English (`en`), with typographic styling tailored for Arabic branding (`Amiri` font).

### 1.3 Target Audience
- Luxury residential homeowners, villa developers, and private individuals.
- Architects, interior designers, landscape architects, and project managers.
- Commercial contractors, luxury hotel chains, and banking institutions (e.g., Attijari Bank, BIAT, UIB, Banque de Tunisie).

### 1.4 Current Development Status
- **Status:** **Active In-Development / Pre-Production Showcase**
  - **Homepage (`/`):** Fully operational with 7 full-height vertical snap panels, loading screen, YouTube video integration, and Framer Motion modal catalogs.
  - **Quote Request (`/devis`):** Fully functional with Zod validation, file upload to Vercel Blob, and Resend transactional email routing.
  - **Contact (`/contact`):** Fully functional with interactive form, map embed, company pillars, and direct WhatsApp / phone actions.
  - **Interactive Catalogue (`/catalogue`):** Fully functional 3D page-flip PDF reader (`react-pageflip` + `react-pdf`) with audio effects and zoom/fullscreen controls.
  - **About Us (`/a-propos`):** Fully functional with heritage milestone timeline, core values, ISO certifications, and team profiles.
  - **Teaser / Sub-routes (`/produits`, `/projets`, `/usine`, `/configurateur-3d`):** Currently render `<ComingSoon />` placeholder pages (content is directly accessible via the homepage interactive modals).

---

## 2. TECH STACK

### 2.1 Core Languages & Frameworks
| Technology | Version | Purpose / Role |
|---|---|---|
| **TypeScript** | `^5.0.0` | Strict static typing across all components, schemas, and actions. |
| **React** | `^19.0.0` | UI component library utilizing React 19 features and Client/Server Components. |
| **React DOM** | `^19.0.0` | React DOM rendering engine. |
| **Next.js** | `^15.2.0` | Fullstack framework using App Router, Server Actions, Dynamic Metadata, SSR/SSG. |

### 2.2 Styling & Typography
| Package | Version | Purpose / Role |
|---|---|---|
| **Tailwind CSS** | `^4.0.0` | Modern utility-first CSS engine (`@tailwindcss/postcss: ^4`, `@theme inline`). |
| **PostCSS** | `^8.4.0` | CSS transformations and bundling. |
| **Next Font (Google)** | Built-in | `Cormorant_Garamond` (primary serif), `Playfair_Display` (display serif), `Amiri` (Arabic branding). |

### 2.3 Animation & Motion Libraries
| Package | Version | Purpose / Role |
|---|---|---|
| **Framer Motion** | `^12.4.7` | UI transitions, modal entry/exit, layout animations, scroll progress tracking. |
| **GSAP (GreenSock)** | `^3.15.0` | Homepage initial loading screen counter, liquid progress, and SVG curved wipe transition. |

### 2.4 Interactive Document & PDF Reader
| Package | Version | Purpose / Role |
|---|---|---|
| **`react-pageflip`** | `^2.0.3` | HTML5 StPageFlip 3D physics engine for realistic magazine page flipping. |
| **`react-pdf`** | `^9.2.1` | PDF rendering in React via canvas elements (`pdfjs-dist`). |
| **PDF.js Web Worker** | Standalone | Worker script located at `public/pdf.worker.min.mjs` for high-performance canvas decoding. |
| **HTML5 Audio API** | Web API | Synchronized audio playback for physical paper page turns (`public/sounds/page-flip.mp3`). |

### 2.5 Form Handling, Validation & Utilities
| Package | Version | Purpose / Role |
|---|---|---|
| **`react-hook-form`** | `^7.88.0` | Performant client-side form state management. |
| **`@hookform/resolvers`**| `^5.9.1` | Zod resolver integration for React Hook Form. |
| **`zod`** | `^4.6.5` | Schema definition, input normalization, phone number regex validation, and type inference. |
| **`lucide-react`** | `^1.46.0` | Iconography suite across UI components. |

### 2.6 Internationalization (i18n)
| Package | Version | Purpose / Role |
|---|---|---|
| **`next-intl`** | `^3.26.5` | Locale routing (`/fr`, `/en`), sub-path routing middleware, server and client translation hooks (`getTranslations`, `useTranslations`). |

### 2.7 External Services, Storage & APIs
| Service / API | Integration Package | Purpose |
|---|---|---|
| **Resend** | `resend: ^6.28.0` | Transactional email delivery for quote requests (`submitDevis`) and contact messages (`submitContactMessage`). |
| **Vercel Blob** | `@vercel/blob: ^2.8.0` | Public CDN blob storage for user uploads; `/devis` accepts files up to 30 MB and `/contact` up to 10 MB. |
| **YouTube IFrame API** | Direct script injection | Viewport-aware autoplaying embedded video showcase on homepage. |
| **Google Maps Embed** | IFrame | Embedded responsive satellite/map location of the Carthage factory. |
| **WhatsApp Direct API**| `wa.me` URL builder | Direct customer messaging with localized prefilled inquiries. |

---

## 3. PROJECT STRUCTURE

```
/Users/hadhoud/Desktop/MTC/
├── .env.local.example                 # Template for required environment variables
├── eslint.config.mjs                  # ESLint 9 configuration with Next.js flat configs
├── legacy/                            # Original static HTML/JS/CSS prototype archive
│   ├── index.html
│   ├── script.js
│   └── style.css
├── next.config.ts                     # Next.js config (i18n plugin, remote image domains)
├── package.json                       # Dependencies, metadata, and scripts
├── postcss.config.mjs                 # PostCSS configuration for Tailwind v4
├── public/                            # Static media, assets, and workers
│   ├── 0.jpg, 00.jpg, 1.jpg..4.jpg    # Marble textures, interior stock photos, factory images
│   ├── Bank de Tunisie.jpg            # Partner bank client logo
│   ├── attijeri.png, biat.png, uib.png# Partner bank client logos
│   ├── catalogue.pdf                  # Official MTC product brochure PDF
│   ├── logo.png                       # MTC high-resolution company emblem
│   ├── pdf.worker.min.mjs             # PDF.js web worker for react-pdf
│   └── sounds/page-flip.mp3           # Page turn sound effect for catalogue
├── src/
│   ├── app/                           # Next.js App Router root
│   │   ├── [locale]/                  # Dynamic locale segment (fr, en)
│   │   │   ├── a-propos/page.tsx      # About Us: history timeline, values, certs, team
│   │   │   ├── catalogue/page.tsx     # Interactive PDF flipbook catalog page
│   │   │   ├── configurateur-3d/page.tsx # 3D visualizer placeholder page
│   │   │   ├── contact/page.tsx       # Contact page: interactive form & company info
│   │   │   ├── devis/page.tsx         # Customized quote request page
│   │   │   ├── layout.tsx             # Root locale layout (Navbar, Footer, ScrollProgress)
│   │   │   ├── not-found.tsx          # Localized 404 error page
│   │   │   ├── page.tsx               # Homepage: LoadingScreen + HomePanelManager
│   │   │   ├── produits/page.tsx      # Products placeholder page
│   │   │   ├── projets/page.tsx       # Projects placeholder page
│   │   │   └── usine/page.tsx         # Factory placeholder page
│   │   ├── actions/                   # Next.js Server Actions ("use server")
│   │   │   ├── submitContactMessage.ts# Contact message processing, upload & email
│   │   │   └── submitDevis.ts         # Quote submission, Vercel Blob upload & email
│   │   ├── globals.css                # Tailwind v4 imports, theme tokens, typography
│   │   ├── layout.tsx                 # Root HTML layout with Google Font variables
│   │   └── not-found.tsx              # Root 404 fallback
│   ├── components/                    # Reusable React components
│   │   ├── apropos/                   # Sections for /a-propos route
│   │   │   ├── CertificationsSection.tsx
│   │   │   ├── CoordonneesSection.tsx
│   │   │   ├── EquipeSection.tsx
│   │   │   ├── HistoireTimeline.tsx
│   │   │   ├── IntroHeader.tsx
│   │   │   └── ValeursSection.tsx
│   │   ├── catalogue/                 # Interactive PDF flipbook reader components
│   │   │   ├── CatalogueErrorBoundary.tsx
│   │   │   ├── CatalogueIntro.tsx
│   │   │   ├── CataloguePageContent.tsx
│   │   │   ├── CatalogueViewer.tsx
│   │   │   ├── FlipBook.tsx
│   │   │   ├── FlipBookControls.tsx
│   │   │   └── FlipBookPage.tsx
│   │   ├── common/                    # Shared generic components
│   │   │   ├── ComingSoon.tsx         # Standalone placeholder banner
│   │   │   ├── FadeInSection.tsx      # Viewport animated reveal wrapper
│   │   │   └── GhostButton.tsx        # Luxury button with sweep animation
│   │   ├── contact/                   # Components for /contact route
│   │   │   ├── ContactForm.tsx        # React Hook Form + Zod message submission
│   │   │   └── ContactInfo.tsx        # Hours, coordinates, map, WhatsApp CTA
│   │   ├── core/                      # Custom UI primitive effects
│   │   │   ├── scroll-progress.tsx    # Framer Motion top page scroll progress bar
│   │   │   └── text-effect.tsx        # Staggered animated typography primitive
│   │   ├── devis/                     # Quote request form components
│   │   │   └── DevisForm.tsx          # Multi-field form with file upload & honeypot
│   │   ├── home/                      # Homepage full-screen panel sections
│   │   │   ├── ConfiguratorPopup.tsx  # Modal: 4 room visualizer selections
│   │   │   ├── ConfiguratorTeaser.tsx # Panel 4: 3D Configurator promotion
│   │   │   ├── Hero.tsx               # Panel 0: 5s crossfade background carousel
│   │   │   ├── HomePanelManager.tsx   # Master 100dvh snap-panel slider controller
│   │   │   ├── LoadingScreen.tsx      # GSAP loading screen with counter & wipe
│   │   │   ├── PanelIndicator.tsx     # Side navigation dot controller
│   │   │   ├── ProductsCataloguePopup.tsx # Modal: 16-product expandable catalog
│   │   │   ├── ProductsPreview.tsx    # Panel 3: Marble collection teaser
│   │   │   ├── ProjetsCataloguePopup.tsx  # Modal: 16-project architecture portfolio
│   │   │   ├── ProjetsShowcase.tsx    # Panel 5: Projects showcase teaser
│   │   │   ├── UsineCataloguePopup.tsx    # Modal: 12-machine factory equipment catalog
│   │   │   ├── UsineShowcase.tsx      # Panel 2: Factory machines teaser carousel
│   │   │   └── VideoShowcase.tsx      # Panel 1: YouTube video with auto-play & mute
│   │   └── layout/                    # Global shell components
│   │       ├── FloatingSocialBar.tsx  # Floating social buttons + scroll to top
│   │       ├── Footer.tsx             # Main footer (links, hours, address, map)
│   │       ├── LanguageSwitcher.tsx   # fr / en language toggle
│   │       ├── LayoutFooter.tsx       # Conditional footer wrapper (hidden on home)
│   │       └── Navbar.tsx             # Adaptive navigation bar (light/dark sync)
│   ├── data/                          # Typed static data dictionaries
│   │   ├── certifications.ts          # ISO 9001, ISO 14001, CE, Artisanat data
│   │   ├── configuratorRooms.ts       # 4 room visualizer configs (kitchen, bath, etc.)
│   │   ├── equipe.ts                  # Leadership & master artisan team profiles
│   │   ├── histoire.ts                # 1989-2024 historical milestone timeline
│   │   ├── productTypes.ts            # Enum & labels for devis form material types
│   │   ├── products.ts                # 16 natural stone products dataset
│   │   ├── projects.ts                # 16 residential & commercial projects dataset
│   │   ├── siteConfig.ts              # Global brand details, contact info, hours, URLs
│   │   ├── testimonials.ts            # Banking client logos and partners
│   │   ├── usine.ts                   # 12 factory workstations and machinery
│   │   └── valeurs.ts                 # 4 corporate values dataset
│   ├── lib/                           # Core utilities, validation, and email
│   │   ├── email/
│   │   │   └── templates.ts           # HTML email template generators (Resend)
│   │   ├── i18n/
│   │   │   ├── dictionaries/          # JSON translation files
│   │   │   │   ├── en.json
│   │   │   │   └── fr.json
│   │   │   ├── request.ts             # next-intl request config loader
│   │   │   └── routing.ts             # next-intl route definitions (locales, prefix)
│   │   └── validations/
│   │       ├── contactSchema.ts       # Zod schema & file validation for Contact
│   │       └── devisSchema.ts         # Zod schema & file validation for Devis
│   ├── middleware.ts                  # next-intl routing middleware
│   └── types/
│       └── content.ts                 # Global TypeScript definitions for content models
├── tsconfig.json                      # TypeScript compiler options & `@/*` alias
└── tsconfig.tsbuildinfo               # TypeScript incremental build cache
```

---

## 4. ARCHITECTURE & DESIGN PATTERNS

### 4.1 High-Level Architecture Overview
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Client Browser                                  │
│  - React 19 Client Components (Framer Motion, GSAP, react-pageflip)          │
│  - Event System: Custom DOM events (mtc-panel-change, mtc-goto-panel)       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                        HTTP Requests / Server Actions
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Next.js 15 App Router                               │
│  - middleware.ts: i18n locale routing (/fr, /en)                            │
│  - src/app/[locale]/layout.tsx: Shell (Navbar, LayoutFooter, ScrollProgress)│
│  - Server-Side Rendering (SSR) & Static Param Generation                    │
└──────────────────────┬───────────────────────────────┬──────────────────────┘
                       │                               │
             Server Actions Invocation          Data Layer & Assets
                       │                               │
        ┌──────────────┴──────────────┐         ┌──────┴──────────────────────┐
        ▼                             ▼         ▼                             ▼
┌──────────────┐             ┌────────────────┐ ┌───────────────────────────┐ │
│ Vercel Blob  │             │  Resend API    │ │  src/data/*.ts            │ │
│ (File Uploads│             │ (Transactional │ │  Static Datasets          │ │
│  PDF/Images) │             │  Emails)       │ │  (Products, Projects,     │ │
└──────────────┘             └────────────────┘ │   Machines, History, etc.)│ │
                                                └───────────────────────────┘ │
```

### 4.2 Key Architectural Patterns

#### 1. Snap-Panel Homepage Navigation (`HomePanelManager`)
- Rather than a standard continuous document scroll, the homepage operates as a **100dvh fixed container** containing 7 vertical panels:
  1. `Hero` (`#accueil`) — Dark
  2. `VideoShowcase` (`#video`) — Light
  3. `UsineShowcase` (`#usine`) — Light
  4. `ProductsPreview` (`#produits`) — Dark
  5. `ConfiguratorTeaser` (`#configurateur`) — Dark
  6. `ProjetsShowcase` (`#projets`) — Dark
  7. `Footer` (`#footer`) — Light
- **Input Orchestration:** Listens to mouse `wheel`, touch `touchstart/touchmove/touchend`, and keyboard keys (`ArrowUp/Down`, `PageUp/Down`, `Space`, `Home`, `End`).
- **Internal Scroll Passthrough:** The `#footer` panel allows internal scrolling until the user reaches the boundaries before triggering panel transitions.
- **Event-Driven Communication:** Dispatches `mtc-panel-change` events with `{ index, id, isLight }` so that `Navbar` can toggle text/logo contrast and `ScrollProgress` can update its spring progress.

#### 2. Server Action File Upload & Dual Email Pipeline
```
[User Form Submit]
      │
      ▼
[Zod Schema Validation + Honeypot Check]
      │ (If Honeypot triggered -> Return fake success silently)
      ▼
[File Binary Validation (PDF/JPEG/PNG/DXF, <= 30MB)]
      │
      ▼
[Upload to @vercel/blob via put()] ──> Returns permanent CDN URL
      │
      ▼
[Compile HTML Templates via buildUsineDevisEmailHtml / buildConfirmationDevisEmailHtml]
      │
      ▼
[Parallel Dispatch via Resend SDK]
 ├── Email 1: Notification sent to Factory (contact@marbrerietuniscarthage.com)
 └── Email 2: Confirmation sent to Client (with WhatsApp Direct CTA)
      │
      ▼
[Return SubmitDevisState JSON to Client Form]
```

#### 3. Bilingual Routing & Request Context
- Configured via `src/lib/i18n/routing.ts` using `defineRouting({ locales: ["fr", "en"], defaultLocale: "fr", localePrefix: "always" })`.
- Handled at edge by `src/middleware.ts` matching `["/", "/(fr|en)/:path*"]`.
- Static and server pages use `setRequestLocale(locale)` and `getTranslations({ locale, namespace })` for zero-overhead SSR translations.

---

## 5. CORE FEATURES

| Feature | Description | Implementation Files | Status |
|---|---|---|---|
| **Snap-Panel Homepage** | Full-height smooth vertical panel slider with dot navigation, gesture handling, hash sync, and dynamic theme contrast adaptation. | `src/components/home/HomePanelManager.tsx`<br>`src/components/home/PanelIndicator.tsx` | **Complete** |
| **GSAP Loading Screen** | Animated preloader with brand logo, live 0-100% counter, and curved SVG wipe transition (stored in `sessionStorage`). | `src/components/home/LoadingScreen.tsx` | **Complete** |
| **YouTube Video Showcase** | Viewport-aware embedded video with auto-play/pause on intersection and interactive mute toggle. | `src/components/home/VideoShowcase.tsx` | **Complete** |
| **Catalogue Modal Popup** | Homepage modal presenting 16 expandable marble products with multi-image carousels and detailed specs. | `src/components/home/ProductsCataloguePopup.tsx`<br>`src/data/products.ts` | **Complete** |
| **Factory Equipment Modal** | Homepage modal showcasing 12 CNC and polishing machines with workshop categories and photo galleries. | `src/components/home/UsineCataloguePopup.tsx`<br>`src/data/usine.ts` | **Complete** |
| **Project Portfolio Modal** | Homepage modal presenting 16 architectural case studies across Residential, Commercial, and Hospitality. | `src/components/home/ProjetsCataloguePopup.tsx`<br>`src/data/projects.ts` | **Complete** |
| **3D Configurator Teaser** | Homepage modal presenting 4 room categories (Kitchen, Bathroom, Living Room, Furniture) with future 3D tool notice. | `src/components/home/ConfiguratorPopup.tsx`<br>`src/data/configuratorRooms.ts` | **Complete** |
| **Quote Request System** | Dedicated quote page with material picker, dimensions, honeypot anti-spam, Vercel Blob attachment upload, and dual Resend email notifications. | `src/app/[locale]/devis/page.tsx`<br>`src/components/devis/DevisForm.tsx`<br>`src/app/actions/submitDevis.ts`<br>`src/lib/validations/devisSchema.ts` | **Complete** |
| **Contact & Inquiries** | Dedicated contact page with company coordinates, opening hours, interactive message form, Google Maps, and WhatsApp CTA. | `src/app/[locale]/contact/page.tsx`<br>`src/components/contact/ContactForm.tsx`<br>`src/components/contact/ContactInfo.tsx`<br>`src/app/actions/submitContactMessage.ts` | **Complete** |
| **Interactive 3D PDF Flipbook** | Interactive brochure reader using WebGL/Canvas PDF rendering, realistic 3D page flip physics, sound effects, page jumps, zoom, and fullscreen. | `src/app/[locale]/catalogue/page.tsx`<br>`src/components/catalogue/FlipBook.tsx`<br>`src/components/catalogue/FlipBookPage.tsx`<br>`src/components/catalogue/FlipBookControls.tsx` | **Complete** |
| **About Us Storytelling** | Comprehensive company history milestone timeline (1989-2024), core values, ISO certifications, and team cards. | `src/app/[locale]/a-propos/page.tsx`<br>`src/components/apropos/*` | **Complete** |
| **Dynamic Navbar & Footer** | Smart sticky navbar switching between light/dark themes depending on active panel or page, with responsive mobile drawer and layout footer. | `src/components/layout/Navbar.tsx`<br>`src/components/layout/Footer.tsx`<br>`src/components/layout/LayoutFooter.tsx` | **Complete** |
| **Dedicated Catalog / Filter Page** | Dedicated full-page marble catalog with search and multi-criteria filters. | `src/app/[locale]/produits/page.tsx` | **Planned** (Currently `<ComingSoon />`) |
| **Dedicated Project Gallery Page** | Standalone case study pages with architectural drawings and photo galleries. | `src/app/[locale]/projets/page.tsx` | **Planned** (Currently `<ComingSoon />`) |
| **Dedicated Factory Tour Page** | Dedicated factory breakdown with virtual workshop walkthrough. | `src/app/[locale]/usine/page.tsx` | **Planned** (Currently `<ComingSoon />`) |
| **Full 3D WebGL Configurator** | WebGL / Three.js 3D room texture visualizer for custom stone customization. | `src/app/[locale]/configurateur-3d/page.tsx` | **Planned** (Currently `<ComingSoon />`) |

---

## 6. SETUP & RUNNING

### 6.1 Prerequisites
- **Node.js:** `v20.x` or `v22.x` recommended
- **Package Manager:** `npm` (uses `package-lock.json`)

### 6.2 Installation Steps
```bash
# Clone the repository
git clone <repo-url>
cd MTC

# Install dependencies
npm install
```

### 6.3 Environment Variables
Create a `.env.local` file in the project root based on `.env.local.example`:

```env
# Resend API Key for sending transactional emails
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# Vercel Blob Read/Write token for user file uploads
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxx
```

> **Note:** If `RESEND_API_KEY` or `BLOB_READ_WRITE_TOKEN` are omitted during development, the form validations still pass, but the server actions will return a `{ status: "error", code: "config" }` error response.

### 6.4 Available Scripts
```bash
# Run local development server (runs on http://localhost:3000)
npm run dev

# Run TypeScript type check across the entire project
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 7. DATA MODELS & API CONTRACTS

### 7.1 Key TypeScript Interfaces (`src/types/content.ts`)

```typescript
export type Locale = "fr" | "en";

export type LocalizedText = { 
  fr: string; 
  en: string; 
};

export interface SiteConfig {
  name: string;
  nameArabic: string;
  founded: number;
  phone: string;
  email: string;
  address: string;
  whatsapp: {
    number: string;
    prefilledMessage: string;
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  hours: { day: LocalizedText; hours: LocalizedText | string }[];
  hoursNote?: LocalizedText;
  assets: {
    logo: string;
    productsSectionBackground: string;
    configuratorBackground: string;
    youtubeVideoId: string;
    googleMapsEmbedUrl: string;
  };
}

export interface Product {
  id: string;
  slug: string;
  image: string;
  images: string[];
  name: LocalizedText;
  tag: LocalizedText;
  category: LocalizedText;
  description: LocalizedText;
  finish: LocalizedText;
}

export interface Project {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  images: string[];
  description: LocalizedText;
}

export interface UsineMachine {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  images: string[];
  description: LocalizedText;
}
```

### 7.2 Server Action Signatures & Return Types

#### `submitDevis` (`src/app/actions/submitDevis.ts`)
```typescript
export type SubmitDevisState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      code: "validation" | "file" | "upload" | "email" | "config";
      fileError?: "fileTooLarge" | "fileTypeInvalid";
    };

export async function submitDevis(
  _prevState: SubmitDevisState,
  formData: FormData
): Promise<SubmitDevisState>;

export async function submitDevisFromClient(
  formData: FormData
): Promise<SubmitDevisState>;
```

#### `submitContactMessage` (`src/app/actions/submitContactMessage.ts`)
```typescript
export type SubmitContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      code: "validation" | "file" | "upload" | "email" | "config";
      fileError?: "fileTooLarge" | "fileTypeInvalid";
    };

export async function submitContactMessage(
  _prevState: SubmitContactState,
  formData: FormData
): Promise<SubmitContactState>;

export async function submitContactMessageFromClient(
  formData: FormData
): Promise<SubmitContactState>;
```

---

## 8. CURRENT STATE & AUDIT

### 8.1 What Works Flawlessly
- **TypeScript Compliance:** `npx tsc --noEmit` compiles with **0 errors**.
- **Linting:** `npm run lint` passes cleanly (one unused variable in an optional primitive helper).
- **Homepage Panel Slider:** Mouse wheel, swipe gestures, keyboard arrows, and hash navigation work with zero scroll-lock freezes.
- **Quote Form (`/devis`):** Validation, Tunisian phone format normalization (`+216...`), honeypot spam protection, and Vercel Blob / Resend email routing.
- **Contact Form (`/contact`):** Full message sending, Google Maps embed, phone/email links, and social links.
- **Interactive Catalogue (`/catalogue`):** Realistic HTML5 canvas flipbook rendering with audio effects, zoom, page jumps, and responsive resizing.
- **About Page (`/a-propos`):** Interactive milestone timeline carousel, company values, certifications, and leadership profiles.

### 8.2 Placeholder Assets & Content Awaiting Real Client Deliverables
Multiple data files contain stock photography and placeholder copy marked with `// SWAP:` comments:
- **`src/data/products.ts`:** 16 product descriptions contain placeholder text (`Lorem ipsum description placeholder, à remplacer par le client`) and some `placehold.co` mock images.
- **`src/data/projects.ts`:** 16 architectural projects have placeholder copy and `placehold.co` image URLs.
- **`src/data/usine.ts`:** 12 machines have placeholder descriptions and `placehold.co` image URLs.
- **`src/data/equipe.ts`:** 4 team members use stock portraits from Unsplash.
- **`src/data/histoire.ts`:** 5 historical milestones use stock architectural photography.
- **`src/data/siteConfig.ts`:** Contains temporary YouTube video ID (`r5NAR0xMqTc`).

### 8.3 Unused / Dead Code
- **`src/data/testimonials.ts` (`trustedClients`):** Exports 6 bank partners (BIAT, Attijari, UIB, etc.) that are currently not rendered in any active page component.
- **`trusted` Translation Namespace in `fr.json` & `en.json`:** Currently unreferenced.
- **`NavItem` Type in `src/types/content.ts`:** Defined but not referenced by `Navbar.tsx` (which defines internal typed arrays).

---

## 9. CODE QUALITY & SECURITY NOTES

### 9.1 Security & Data Protection
- **Honeypot Anti-Spam:** Both `/devis` and `/contact` include hidden honeypot fields (`website`). If filled by automated spam bots, the server silently returns a fake success without invoking Resend or Vercel Blob.
- **Strict File Upload Constraints:** File uploads are validated both client-side and server-side:
  - Allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`.
  - Max file size: `/devis` `30 MB` (`30 * 1024 * 1024` bytes); `/contact` `10 MB` (`10 * 1024 * 1024` bytes).
  - Next.js Server Actions request-body limit: `31mb` to accommodate multipart form overhead for a 30 MB attachment (`next.config.ts`).
  - Filename sanitization: `file.name.replace(/[^a-zA-Z0-9._-]/g, "_")` prevents directory traversal attacks.
- **HTML Injection Protection:** All user-submitted text inputs in email templates are passed through `escapeHtml()` replacing `&`, `<`, `>`, and `"` before HTML concatenation.

### 9.2 Technical Debt & Nuances
- **`react-pageflip` Typing:** `react-pageflip` has loose React 19 type bindings, requiring `any` refs in `FlipBook.tsx`.
- **Canvas Sizing on Mobile:** In `FlipBook.tsx`, canvas pixel ratio rendering must adapt on resize to prevent GPU memory pressure on low-end mobile devices.
- **Navbar Route vs Anchor Inconsistency:**
  - On the homepage, Navbar links trigger smooth panel navigation via custom DOM events (`mtc-goto-panel`).
  - From subpages (e.g., `/contact`, `/devis`), clicking `#usine` or `#produits` navigates to `/[locale]/#usine`.

---

## 10. CONVENTIONS & CODING PATTERNS

### 10.1 File Organization & Naming
- **Components:** PascalCase (e.g., `DevisForm.tsx`, `HomePanelManager.tsx`, `FlipBook.tsx`).
- **Data & Config:** camelCase (e.g., `siteConfig.ts`, `products.ts`, `histoire.ts`).
- **Server Actions:** camelCase (e.g., `submitDevis.ts`, `submitContactMessage.ts`).
- **Validation Schemas:** camelCase with `Schema` suffix (e.g., `devisSchema.ts`, `contactSchema.ts`).

### 10.2 Styling Conventions
- Colors and typography follow custom Tailwind v4 theme tokens in `src/app/globals.css`:
  - `--color-brand-orange: #ef5d36` (Primary luxury accent)
  - `--color-brand-dark: #1a1a1a` (Deep obsidian background)
  - `--color-brand-dark-alt: #2d2d2d` (Card background)
  - `--color-brand-light: #f8f9fa` (Off-white background)
  - `--font-serif: var(--font-cormorant)`
  - `--font-display: var(--font-playfair)`
  - `--font-arabic: var(--font-amiri)`

### 10.3 Component Conventions
- Use `"use client"` directive strictly when components require React state, lifecycle hooks, browser DOM APIs, or Framer Motion/GSAP animations.
- Keep pages as Server Components when generating dynamic metadata or rendering static data.

---

## 11. NEXT STEPS & LOGICAL ROADMAP

1. **Replace Placeholder Content & Assets (Client Deliverables):**
   - Replace stock photos in `src/data/products.ts`, `src/data/projects.ts`, `src/data/usine.ts`, `src/data/equipe.ts`, and `src/data/histoire.ts` with genuine high-resolution client photos.
   - Insert final production YouTube video ID in `siteConfig.assets.youtubeVideoId`.
2. **Build Dedicated Sub-Pages:**
   - Implement dedicated `/produits` page with stone color/finish filter grids.
   - Implement dedicated `/projets` page with category filters and project case study modals.
   - Implement dedicated `/usine` page with machinery diagrams and process workflows.
3. **Incorporate Partner Logos Section:**
   - Integrate the existing `trustedClients` dataset (`src/data/testimonials.ts`) into a luxury bank/client partner carousel on the homepage or `/a-propos` page.
4. **Develop Full 3D Interactive Configurator (`/configurateur-3d`):**
   - Build a Three.js / React Three Fiber interactive room visualizer allowing users to swap marble materials onto kitchen countertops and bathroom vanities in real time.

---

## 12. KEY CODE SNIPPETS

### 12.1 Localization Routing Config (`src/lib/i18n/routing.ts`)
```typescript
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### 12.2 Next.js Config with next-intl (`next.config.ts`)
```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
```

### 12.3 Devis Zod Validation Schema (`src/lib/validations/devisSchema.ts`)
The form state uses `products: QuoteProduct[]`, initially one item and capped at three. Each item contains `type`, `variete`, `longueur`, `largeur`, `epaisseur`, `quantite`, `finition`, and `otherFinitionText`. `DevisForm.tsx` keeps one visible product section bound to `activeIndex`; switching tabs preserves the other entries. The client serializes the array as JSON in the `products` FormData field. `parseDevisFormData` reads that JSON and `devisFormSchema` validates every item and enforces a minimum of one and maximum of three; dimensions are derived per item for emails. Both quote email templates iterate through the validated array. Every catalogue slug that can be assigned to `variete` must also exist in `src/data/productSubtypes.ts` with the same product type, or server validation will reject that product. `QuoteBasketProvider` (`src/components/devis/QuoteBasketContext.tsx`) is mounted in the locale layout and persists the basket plus contact draft under localStorage key `mtc3d.quoteDraft.v1`; catalogue cards toggle unique products, the floating link displays the current count, and successful submission clears the stored quote. Browser-selected file binaries are not persisted by localStorage and must be reattached after a reload.

### 12.4 Server Action for Quote Submissions (`src/app/actions/submitDevis.ts`)
```typescript
"use server";

import { put } from "@vercel/blob";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/data/siteConfig";
import { PRODUCT_TYPE_VALUES, type ProductTypeValue } from "@/data/productTypes";
import { buildConfirmationDevisEmailHtml, buildUsineDevisEmailHtml } from "@/lib/email/templates";
import { devisFormSchema, parseDevisFormData, validateDevisFile } from "@/lib/validations/devisSchema";

export type SubmitDevisState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      code: "validation" | "file" | "upload" | "email" | "config";
      fileError?: "fileTooLarge" | "fileTypeInvalid";
    };

export async function submitDevis(
  _prevState: SubmitDevisState,
  formData: FormData,
): Promise<SubmitDevisState> {
  const localeRaw = formData.get("locale");
  const locale = localeRaw === "en" ? "en" : "fr";
  const raw = parseDevisFormData(formData);

  // Honeypot spam check
  if (raw.honeypot && raw.honeypot.trim().length > 0) {
    return { status: "success" };
  }

  const parsed = devisFormSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", code: "validation" };

  const data = parsed.data;
  const fileEntry = formData.get("fichier");
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  const fileValidation = validateDevisFile(file);
  if (!fileValidation.ok) {
    return { status: "error", code: "file", fileError: fileValidation.message };
  }

  if (!process.env.RESEND_API_KEY) return { status: "error", code: "config" };

  let fileUrl: string | null = null;
  if (file) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return { status: "error", code: "config" };
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await put(`devis/${Date.now()}-${safeName}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      fileUrl = blob.url;
    } catch {
      return { status: "error", code: "upload" };
    }
  }

  const tUsine = await getTranslations({ locale: "fr", namespace: "devis.emailUsine" });
  const tConfirm = await getTranslations({ locale, namespace: "devis.emailConfirm" });

  const productTypes = Object.fromEntries(
    PRODUCT_TYPE_VALUES.map((key) => [key, tUsine(`productTypes.${key}`)]),
  ) as Record<ProductTypeValue, string>;

  const usineHtml = buildUsineDevisEmailHtml(data, {
    heading: tUsine("heading"),
    nom: tUsine("nom"),
    prenom: tUsine("prenom"),
    email: tUsine("email"),
    telephone: tUsine("telephone"),
    productType: tUsine("productType"),
    dimensions: tUsine("dimensions"),
    fileLink: tUsine("fileLink"),
    noFile: tUsine("noFile"),
    productTypes,
  }, fileUrl);

  const confirmHtml = buildConfirmationDevisEmailHtml({
    subject: tConfirm("subject"),
    greeting: tConfirm("greeting", { name: data.prenom }),
    body: tConfirm("body"),
    fallbackLabel: tConfirm("fallback"),
    whatsappLabel: tConfirm("whatsapp"),
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromAddress = `${siteConfig.name} <${siteConfig.email}>`;

  try {
    const [usineResult, confirmResult] = await Promise.all([
      resend.emails.send({
        from: fromAddress,
        to: siteConfig.email,
        replyTo: data.email,
        subject: tUsine("subject", { name: `${data.prenom} ${data.nom}` }),
        html: usineHtml,
      }),
      resend.emails.send({
        from: fromAddress,
        to: data.email,
        subject: tConfirm("subject"),
        html: confirmHtml,
      }),
    ]);

    if (usineResult.error || confirmResult.error) return { status: "error", code: "email" };
  } catch {
    return { status: "error", code: "email" };
  }

  return { status: "success" };
}
```

### 12.5 Master Homepage Snap Slider (`src/components/home/HomePanelManager.tsx` excerpt)
```typescript
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Hero from "./Hero";
import VideoShowcase from "./VideoShowcase";
import UsineShowcase from "./UsineShowcase";
import ProductsPreview from "./ProductsPreview";
import ConfiguratorTeaser from "./ConfiguratorTeaser";
import ProjetsShowcase from "./ProjetsShowcase";
import Footer from "@/components/layout/Footer";
import PanelIndicator, { PanelInfo } from "./PanelIndicator";

export const HOME_PANELS: PanelInfo[] = [
  { id: "accueil", nameKey: "accueil", defaultLabel: "Accueil", isLight: false },
  { id: "video", nameKey: "video", defaultLabel: "Vidéo", isLight: true },
  { id: "usine", nameKey: "usine", defaultLabel: "L'usine", isLight: true },
  { id: "produits", nameKey: "produits", defaultLabel: "Nos Produits", isLight: false },
  { id: "configurateur", nameKey: "configurateur", defaultLabel: "Configurateur 3D", isLight: false },
  { id: "projets", nameKey: "projets", defaultLabel: "Nos Projets", isLight: false },
  { id: "footer", nameKey: "footer", defaultLabel: "Contact & Liens", isLight: true },
];

export default function HomePanelManager() {
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const activePanelIndexRef = useRef(0);
  const isLockedRef = useRef(false);

  const goToPanel = useCallback((targetIndex: number) => {
    const nextIndex = ((targetIndex % HOME_PANELS.length) + HOME_PANELS.length) % HOME_PANELS.length;
    if (activePanelIndexRef.current === nextIndex) return;

    isLockedRef.current = true;
    setTimeout(() => { isLockedRef.current = false; }, 850);

    activePanelIndexRef.current = nextIndex;
    setActivePanelIndex(nextIndex);

    const panel = HOME_PANELS[nextIndex];
    if (panel && typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${panel.id}`);
      window.dispatchEvent(
        new CustomEvent("mtc-panel-change", {
          detail: { index: nextIndex, id: panel.id, isLight: panel.isLight },
        })
      );
    }
  }, []);

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-brand-dark select-none">
      <PanelIndicator panels={HOME_PANELS} activeIndex={activePanelIndex} onSelect={goToPanel} />
      <motion.div
        className="w-full h-full flex flex-col"
        animate={{ y: `-${activePanelIndex * 100}%` }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Render 7 Panels */}
      </motion.div>
    </div>
  );
}
```
