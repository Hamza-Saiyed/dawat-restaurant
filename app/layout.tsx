import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Jost } from "next/font/google";
import "@/styles/globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import React from "react";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-cormorant" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });

export const metadata: Metadata = {
  metadataBase: new URL("https://dawat-restaurant.com"),
  title: "Dawat Restaurant | Authentic North Indian Cuisine | Ahmedabad",
  description: "Experience the finest North Indian cuisine at Dawat Restaurant in Ahmedabad. Dine-in, Takeaway & Kerbside Pickup. Open 11 AM - 1 AM. Book your table now!",
  keywords: ["North Indian restaurant Ahmedabad", "best biryani Ahmedabad", "butter chicken", "Vishala restaurant", "Dawat restaurant"],
  openGraph: {
    title: "Dawat Restaurant",
    description: "Authentic North Indian Cuisine in Ahmedabad",
    url: "https://dawat-restaurant.com",
    siteName: "Dawat Restaurant",
    images: [
      {
        url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${jost.variable} antialiased`}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
