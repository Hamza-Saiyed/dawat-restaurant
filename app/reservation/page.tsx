import SectionTitle from "@/components/ui/SectionTitle";
import BookingForm from "@/components/reservation/BookingForm";

export default function ReservationPage() {
  return (
    <main className="min-h-screen bg-dark pt-32 pb-24 relative overflow-hidden">
      {/* Decorative Ornaments */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          subtitle="Reserve Your Table"
          title="Book an Experience"
          description="Join us for an unforgettable dining experience. Please fill out the form below to secure your table."
        />

        <div className="mt-16 max-w-4xl mx-auto">
          <BookingForm />
        </div>
      </div>
    </main>
  );
}
