# DAWAT RESTAURANT - ADMIN PANEL SPECIFICATION

## Overview
A secure, production-ready Admin Dashboard built into the existing Dawat Restaurant Next.js 14 project. 
It operates under the `/admin` and `/api/admin` routes to manage reservations, menu items, gallery images, customer reviews, contact messages, and site settings.

## Design System
- **Theme**: Dark mode default (Admin specific), professional SaaS aesthetic.
- **Colors**: Deep navy black backgrounds (`#0D0F14`), gold accents (from brand), distinct status colors.
- **Typography**: Inter (UI), JetBrains Mono (Data/Code), Playfair Display (Logo only).
- **Tooling**: Stitch-generated, glassmorphism, micro-animations.

## Features & Pages
1. **Authentication**: JWT-cookie based login, bcrypt hashing, rate-limiting (5 attempts/15min).
2. **Dashboard**: High-level metrics, Chart.js trends, recent activity.
3. **Reservations**: Data table with filtering, inline status updates (pending/approved/rejected/completed).
4. **Menu**: CRUD operations, Cloudinary image upload, category/availability toggles.
5. **Gallery**: Masonry grid, drag-and-drop ordering, multi-image upload via Cloudinary.
6. **Reviews**: Moderation (approve/reject/spam) of customer feedback.
7. **Messages**: Inbox-style view for contact form submissions.
8. **Settings**: Dynamic configuration for hours, contact info, SEO, and Hero section.

## Data Models
- **New**: `Admin`, `MenuItem`, `GalleryImage`, `Review`, `SiteSettings`
- **Updated**: `Reservation` (added status, notes), `Contact` (added read/replied states)

## Security
- Next.js Middleware protecting all `/admin` routes (except login).
- JWT HttpOnly cookies tracking sessions.
- Rate limits on authentication endpoints.

## Dependencies Added
`bcryptjs`, `jsonwebtoken`, `cloudinary`, `react-chartjs-2`, `chart.js`, `@hello-pangea/dnd`, `react-dropzone`.
