# 🍽️ DAWAT RESTAURANT

A complete, production-ready, fully deployable restaurant website built with Next.js 14, Tailwind CSS, and MongoDB.

## 🌟 Features
- **Premium UI/UX**: Dark theme with gold luxury accents.
- **Responsive Layout**: Works seamlessly across mobile, tablet, and desktop devices.
- **Framer Motion Animations**: Smooth page transitions, parallax scrolling, and micro-interactions.
- **App Router**: Leveraging the latest Next.js 14 features for maximum performance.
- **Full-Stack Reservations**: A fully functional booking form integrated with MongoDB via API routes.
- **WhatsApp Integration**: Direct ordering linked via WhatsApp Floating CTA.

## 🛠️ Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

---

## 🚀 Quick Start

Follow these steps to get the project running locally:

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/dawat-restaurant
cd dawat-restaurant
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables Setup
Copy the environment example file:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`
Edit `.env.local` to include your MongoDB connection string:
- Sign up for a free tier database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a Cluster and specify `MONGODB_URI` in the file.

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 📁 Folder Structure

\`\`\`
dawat-restaurant/
├── app/                  # Next.js App Router (pages and API routes)
├── components/           # Reusable UI components
│   ├── home/             # Homepage sections
│   ├── layout/           # Shared Navigation and Footer
│   ├── menu/             # Menu Cards and Tabs
│   ├── ui/               # Small standalone reusable components
│   └── ...
├── data/                 # Static data (complete menu array)
├── lib/                  # Utilities (MongoDB connection, Zod validation)
├── models/               # Mongoose schemas (Reservation, Contact)
├── public/               # Static assets
└── styles/               # Global CSS variables and configs
\`\`\`

---

## 🌐 API Documentation

### POST `/api/reservations`
Content-Type: `application/json`
Creates a new reservation. Expected body matches `reservationSchema` in `lib/validations.ts`.

### POST `/api/contact`
Content-Type: `application/json`
Sends a contact form message. Expected body matches `contactSchema`.

---

## 🚢 Deployment on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub.
2. Go to Vercel and select **"New Project"** -> **"Import from GitHub"**.
3. Under Environment Variables, add your `MONGODB_URI` and `NEXT_PUBLIC_WHATSAPP_NUMBER`.
4. Click **Deploy**.

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

---

## 🔮 Future Improvements
- Implement a Headless CMS (like Sanity or Strapi) or an Admin Dashboard to easily update the menu.
- Add payment gateway integration for direct takeaways.
- Integrate Google Maps API dynamically (currently using an iframe embed for simplicity).
