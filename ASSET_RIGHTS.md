# Salman Hair Studio — Digital Asset Rights & Licensing Manifest

**Website:** [https://salmanhairstudio.com](https://salmanhairstudio.com/)  
**Studio Location:** Shop No. 5, Manav Drishti Apartments, LBS Marg, Kurla West, Mumbai 400070  
**Audit Date:** October 9, 2026  
**Document Status:** Complete Audit & Production Recovery Verification

---

## 1. Executive Summary

This document establishes the origin, rights ownership, copyright compliance, and performance recommendations for all static digital media, video, audio, 3D elements, and fonts utilized across the Salman Hair Studio web application.

Following our comprehensive production and legal compliance audit:
- **Zero Third-Party Reviewer Stock Images:** All Unsplash reviewer avatars previously associated with client testimonials have been completely purged from the codebase to maintain strict compliance with the **Consumer Protection Act, 2019** (Guidelines for Prevention of Misleading Advertisements and Endorsements).
- **Client Testimonials:** Real client praise is rendered using clean initials avatars and direct outbound verification links to the studio's verified Google Maps listing.
- **Original Studio Assets:** Studio video and interior photography belong exclusively to Salman Hair Studio.

---

## 2. Media Asset Directory & Licensing Status

| Asset Path / Category | Description | Ownership & License Status | Action / Recommendation |
| :--- | :--- | :--- | :--- |
| `/videos/studio-showcase.mp4` (2.54 MB) & `/videos/studio-poster.webp` (10 KB) | Optimized H.264 High 1080p web stream (+faststart) & initial frame poster | **Proprietary:** Owned by Salman Hair Studio. Transcoded from raw 28.3MB reel. | **Optimized:** 91% size reduction from 28.3MB to 2.54MB. Lazy-loaded on viewport entry with `preload="none"`. Instant start with faststart header. |
| `/videos/WhatsApp 2026-08-16 22-00-16.mp4` (28.3 MB) | Original master studio haircut & styling reel captured inside Kurla West atelier | **Proprietary:** Master footage archive. | Kept as uncompressed master archive. Production uses `studio-showcase.mp4`. |
| `/images/hero/*.png` | Hero carousel images showcasing signature cuts & fades | **Proprietary / Client Portfolio:** Original client cuts photographed at the atelier. | Next.js Image component automatically serves responsive WebP/AVIF variants. Recommend normalizing filenames (replacing spaces with hyphens). |
| `/images/branding/*.png` | Salon interior sanctuary, styling station, and consultation suite | **Proprietary:** Studio photography by Salman Hair Studio / Developer. | Validated. Converted on-demand by Next.js image optimizer. |
| `/images/gallery/*.png`, `*.jpeg` | Portfolio transformations, bridal coiffure, and color treatments | **Proprietary:** Client transformations photographed in-salon. | Validated. |
| `/images/services/*.webp` (21 files) | Curated male and female service illustrations (balayage, botox, fades, facials) | **Licensed / Generated Styling References:** High-resolution optimized WebP assets. | Verified optimized (<200KB each). [OWNER APPROVAL REQUIRED: Final confirmation of commercial styling imagery]. |
| Procedural Scissors (`ScissorSection.jsx`) | Interactive 3D shears and SVG fallback | **Original Custom Code:** Procedural Three.js geometry with standalone SVG vector fallback (`ScissorsSVGPoster`). | 100% royalty-free, self-contained, zero external GLTF dependencies. Immediate paint on low-end mobile devices. |

---

## 3. Fonts & Typography Licensing

| Typeface | Source | License | Usage |
| :--- | :--- | :--- | :--- |
| **Inter** | Google Fonts | SIL Open Font License (OFL) 1.1 | Body typography, data labels, buttons |
| **Outfit** / **Playfair** / **Cormorant** | Google Fonts | SIL Open Font License (OFL) 1.1 | Luxury editorial headings, brand logo, numbers |

Both font families are fully permissive for commercial web use with no attribution required.

---

## 4. Software Libraries & Code Dependencies

| Package | Purpose | License |
| :--- | :--- | :--- |
| `next`, `react`, `react-dom` | Core framework & UI runtime | MIT License |
| `lucide-react` | Semantic UI icons | ISC License |
| `three`, `@react-three/fiber`, `@react-three/drei` | 3D rendering pipeline | MIT / Apache 2.0 |
| `gsap` | Smooth scroll & editorial transitions | Standard GreenSock Web License |
| `tailwindcss` | Utility CSS framework | MIT License |
| `clsx`, `tailwind-merge` | Class name manipulation | MIT License |

---

## 5. Endorsement & Consumer Protection Compliance (India)

Under the **Consumer Protection Act, 2019** and the **CCPA Guidelines for Prevention of Misleading Advertisements and Endorsements for Goods and Services (2022)**:
1. **No Fictitious Endorsements:** Stock photography models may never be represented as real salon customers with false "Google Verified" stamps.
2. **Current Implementation:** The Salman Hair Studio website strictly utilizes real client initial badges and directs visitors directly to the genuine Google Maps listing (`https://maps.app.goo.gl/WWVvviNqthgHYNjw7`) where 360+ authentic reviews and photos reside.
3. **Owner Verification:** Salon management (Salman & Farmaan Malik) confirms all testimonial quotes reflect genuine client feedback received at the Kurla West studio.

---

## 6. Action Items for Salon Management

1. **Video Optimization (Optional but Recommended):** Transcode the 28.3MB studio video to a compressed 720p/1080p MP4 (<3MB) and WebM format to further reduce mobile data usage for 4G clients in Mumbai.
2. **Legal Policies Review:** Review the newly established `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`, and `/refund-policy` with legal counsel for statutory filing.
3. **Google Review API (Future Enhancement):** Consider integrating the official Google Places API to dynamically fetch real-time reviews directly with verified Google user profile images.
