import HeroSection from "@/components/home/HeroSection";
import AboutPreview from "@/components/home/AboutPreview";
import MenuHighlights from "@/components/home/MenuHighlights";
import GalleryPreview from "@/components/home/GalleryPreview";
import ReviewsSection from "@/components/home/ReviewsSection";
import MapSection from "@/components/home/MapSection";
import ContactInfo from "@/components/home/ContactInfo";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark">
      <HeroSection />
      <AboutPreview />
      <MenuHighlights />
      <GalleryPreview />
      <ReviewsSection />
      <MapSection />
      <ContactInfo />
    </main>
  );
}
