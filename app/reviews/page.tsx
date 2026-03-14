import SectionTitle from "@/components/ui/SectionTitle";
import { Star } from "lucide-react";

export default function ReviewsPage() {
  const reviews = [
    { id: 1, name: "Rahul Sharma", rating: 5, date: "2 weeks ago", platform: "Google", text: "Best butter chicken in Ahmedabad! The ambiance is royal and service is top-notch. Highly recommend for families." },
    { id: 2, name: "Priya Patel", rating: 5, date: "1 month ago", platform: "Zomato", text: "Visited for our anniversary dinner. Absolutely loved the mutton biryani and the staff made us feel very special." },
    { id: 3, name: "Amit Shah", rating: 4, date: "3 weeks ago", platform: "Google", text: "Great food quality. The Dal Makhani reminded me of home-cooked meals but richer. Will definitely come back!" },
    { id: 4, name: "Sneha Verma", rating: 5, date: "2 months ago", platform: "Zomato", text: "Seekh kebabs were outstanding! Authentic North Indian flavors that are hard to find in the city." },
    { id: 5, name: "Karan Mehta", rating: 4, date: "1 week ago", platform: "Google", text: "Good food and decent prices for the portion size. The garlic naan was perfectly soft and the paneer tikka was excellent." },
    { id: 6, name: "Ananya Joshi", rating: 5, date: "3 months ago", platform: "Google", text: "Perfect place for a family dinner. Kids loved the mild dishes too! Great variety of options on the menu." },
    { id: 7, name: "Ravi Kumar", rating: 5, date: "4 days ago", platform: "Zomato", text: "Late night dining done right! Open till 1 AM is a blessing for us. Food was fresh and delicious even at midnight." },
    { id: 8, name: "Meera Desai", rating: 4, date: "1 month ago", platform: "Google", text: "Loved the ambiance and the Shahi Paneer. Service could be just a tiny bit faster on weekends as it gets crowded." },
    { id: 9, name: "Vijay Nair", rating: 5, date: "2 weeks ago", platform: "Google", text: "First time visit but definitely not the last. The Tandoori chicken was perfectly charred and juicy." },
    { id: 10, name: "Pooja Agarwal", rating: 5, date: "5 days ago", platform: "Zomato", text: "The best restaurant near Vishala! We also do regular takeaway orders and the packaging is always secure. 10/10!" },
  ];

  return (
    <main className="min-h-screen bg-dark pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-16">
          <div className="lg:col-span-2">
            <SectionTitle
              subtitle="Guest Experiences"
              title="Words from Our Patrons"
              description="Read what our diners have to say about their experience at Dawat Restaurant."
              centered={false}
            />
          </div>
          
          <div className="bg-[#111111] p-8 border border-gold/20 text-center flex flex-col items-center justify-center h-full shadow-[0_0_20px_rgba(201,168,76,0.1)]">
            <div className="text-5xl font-playfair text-gold font-bold mb-2">4.7</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className={i < 4 ? "text-gold fill-gold" : "text-gold/50 fill-gold/50"} />
              ))}
            </div>
            <p className="font-jost text-text-muted text-sm uppercase tracking-widest mb-6">Based on 500+ Reviews</p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent border border-gold text-gold font-jost uppercase tracking-widest text-sm py-2 px-6 hover:bg-gold hover:text-dark transition-colors duration-300 w-full"
            >
              Write a Review
            </a>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 columns-1 md:columns-2 lg:columns-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-dark-card border border-gold/10 p-8 hover:border-gold/30 transition-colors duration-300 mughal-border break-inside-avoid shadow-lg relative h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-dark border border-gold/50 flex items-center justify-center font-playfair text-xl text-gold mr-4">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-playfair text-lg text-text-primary leading-tight">{review.name}</h4>
                    <span className="font-cormorant text-text-muted text-sm italic">{review.date}</span>
                  </div>
                </div>
                <div className="bg-dark px-2 py-1 rounded text-xs text-text-secondary border border-white/5">
                  {review.platform}
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < review.rating ? "text-gold fill-gold mr-1" : "text-gray-600 mr-1"} />
                ))}
              </div>
              
              <p className="font-cormorant text-lg text-text-secondary leading-relaxed flex-grow">
                &quot;{review.text}&quot;
              </p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
